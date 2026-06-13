import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { ContentPost } from './models/content-post.model';
import { ContentCategory } from './models/content-category.model';
import { ContentPostCategory } from './models/content-post-category.model';
import { ContentMedia } from './models/content-media.model';
import { ContentLike } from './models/content-like.model';
import { ContentBookmark } from './models/content-bookmark.model';
import { ContentComment } from './models/content-comment.model';
import { ContentTag } from './models/content-tag.model';
import { ContentPostTag } from './models/content-post-tag.model';
import { ContentSubscription } from './models/content-subscription.model';
import { ContentPostPurchase } from './models/content-post-purchase.model';
import { User } from '../users/user.model';
import { ContentPayment } from './models/content-payment.model';
import { Op } from 'sequelize';

import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { ContentSubscriptionPlan } from './models/content-subscription-plan.model';
import { VerifyContentPaymentDto } from './dto/verify-content-payment.dto';
import { ProgressLevel } from 'src/daily-progress/progress-level.model';
import { DailyProgressService } from 'src/daily-progress/daily-progress.service';

@Injectable()
export class ContentService {
  private razorpay: Razorpay;
  constructor(
    @InjectModel(ContentPost)
    private readonly postModel: typeof ContentPost,

    @InjectModel(ContentCategory)
    private readonly categoryModel: typeof ContentCategory,

    @InjectModel(ContentPostCategory)
    private readonly postCategoryModel: typeof ContentPostCategory,

    @InjectModel(ContentMedia)
    private readonly mediaModel: typeof ContentMedia,

    @InjectModel(ContentLike)
    private readonly likeModel: typeof ContentLike,

    @InjectModel(ContentBookmark)
    private readonly bookmarkModel: typeof ContentBookmark,

    @InjectModel(ContentComment)
    private readonly commentModel: typeof ContentComment,

    @InjectModel(ContentTag)
    private readonly tagModel: typeof ContentTag,

    @InjectModel(ContentPostTag)
    private readonly postTagModel: typeof ContentPostTag,

    @InjectModel(ContentSubscription)
    private readonly subscriptionModel: typeof ContentSubscription,

    @InjectModel(ContentPayment)
    private readonly contentPaymentModel: typeof ContentPayment,

    @InjectModel(ContentPostPurchase)
    private readonly purchaseModel: typeof ContentPostPurchase,

    @InjectModel(ContentSubscriptionPlan)
    private readonly subscriptionPlanModel: typeof ContentSubscriptionPlan,

    private readonly progressService: DailyProgressService,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private isAdmin(user: any) {
    return user?.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN');
  }

  private canEdit(post: ContentPost, user: User) {
    return post.author_id === user.id || this.isAdmin(user);
  }

  async createPost(dto: any, user: User) {
    const slug = dto.slug || this.slugify(dto.title);

    const existing = await this.postModel.findOne({ where: { slug } });

    if (existing) {
      throw new BadRequestException('Post slug already exists');
    }

    const post = await this.postModel.create({
      uuid: uuidv4(),
      author_id: user.id,
      title: dto.title,
      slug,
      type: dto.type,
      visibility: dto.visibility || 'free',
      access_type: dto.access_type || 'free',
      excerpt: dto.excerpt || null,
      content: dto.content,
      cover_image_url: dto.cover_image_url || null,
      thumbnail_url: dto.thumbnail_url || null,
      banner_image_url: dto.banner_image_url || null,
      price_amount: dto.price_amount || 0,
      currency: dto.currency || 'INR',
      status: dto.status || 'draft',
      published_at:
        dto.status === 'published' ? new Date() : dto.published_at || null,
      view_count: 0,
      target_level_id: dto.target_level_id || null,
    });

    if (Array.isArray(dto.category_ids)) {
      for (const categoryId of dto.category_ids) {
        await this.postCategoryModel.create({
          uuid: uuidv4(),
          post_id: post.id,
          category_id: categoryId,
        });
      }
    }

    if (Array.isArray(dto.tag_ids)) {
      for (const tagId of dto.tag_ids) {
        await this.postTagModel.create({
          uuid: uuidv4(),
          post_id: post.id,
          tag_id: tagId,
        });
      }
    }

    if (Array.isArray(dto.media)) {
      for (const mediaItem of dto.media) {
        await this.mediaModel.create({
          uuid: uuidv4(),
          post_id: post.id,
          media_type: mediaItem.media_type || 'image',
          file_url: mediaItem.file_url,
          thumbnail_url: mediaItem.thumbnail_url || null,
          title: mediaItem.title || null,
          sort_order: mediaItem.sort_order || 1,
          is_featured: mediaItem.is_featured || false,
        });
      }
    }

    return {
      message: 'Content post created successfully',
      post,
    };
  }

  async findPublishedPosts(type?: string, category?: string) {
    const where: any = {
      status: 'published',
    };

    if (type) {
      where.type = type;
    }

    const include: any[] = [
      { model: ContentMedia },
      {
        model: ContentPostCategory,
        include: [{ model: ContentCategory }],
      },
      {
        model: ContentPostTag,
        include: [{ model: ContentTag }],
      },
      { model: User, as: 'author' },
      {
        model: ProgressLevel,
      },
    ];

    return this.postModel.findAll({
      where,
      include,
      order: [['published_at', 'DESC']],
    });
  }

  async findPost(uuid: string, user?: User | null) {
    const post = await this.postModel.findOne({
      where: { uuid },
      include: [
        { model: ContentMedia },
        {
          model: ContentPostCategory,
          include: [{ model: ContentCategory }],
        },
        {
          model: ContentPostTag,
          include: [{ model: ContentTag }],
        },
        { model: User, as: 'author' },
        {
          model: ProgressLevel,
        },
      ],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const plain = post.get({ plain: true }) as any;

    const canRead = await this.canReadPost(post, user);

    await post.update({
      view_count: Number(post.view_count || 0) + 1,
    });

    if (!canRead) {
      return {
        ...plain,
        content: null,
        is_locked: true,
        lock_message: 'This content requires subscription or purchase',
      };
    }

    return {
      ...plain,
      is_locked: false,
    };
  }

  async findAuthorPost(uuid: string, user?: User | null) {
    const post = await this.postModel.findOne({
      where: { uuid },
      include: [
        { model: ContentMedia },
        {
          model: ContentPostCategory,
          include: [{ model: ContentCategory }],
        },
        {
          model: ContentPostTag,
          include: [{ model: ContentTag }],
        },
        { model: User, as: 'author' },
        {
          model: ProgressLevel,
        },
      ],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const plain = post.get({ plain: true }) as any;

    console.log(user);

    // Author can always access own content
    if (user && post.author_id === user.id) {
      await post.update({
        view_count: Number(post.view_count || 0) + 1,
      });

      return {
        ...plain,
        is_locked: false,
      };
    }

    const canRead = await this.canReadPost(post, user);

    await post.update({
      view_count: Number(post.view_count || 0) + 1,
    });

    if (!canRead) {
      return {
        ...plain,
        content: null,
        is_locked: true,
        lock_message: 'This content requires subscription or purchase',
      };
    }

    return {
      ...plain,
      is_locked: false,
    };
  }

  private async canReadPost(post: ContentPost, user?: User | null) {
    if (post.status !== 'published') return false;

    if (post.access_type === 'free' || post.visibility === 'free') {
      return true;
    }

    // author can read own content
    if (user && post.author_id === user.id) {
      return true;
    }

    // no user means locked
    if (!user) {
      return false;
    }

    // active subscription unlocks all paid content
    const activeSubscription = await this.subscriptionModel.findOne({
      where: {
        user_id: user.id,
        status: 'active',
        start_date: {
          [Op.lte]: new Date(),
        },
        end_date: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (activeSubscription) {
      return true;
    }

    // one-time purchase unlocks only this post
    const purchase = await this.contentPaymentModel.findOne({
      where: {
        user_id: user.id,
        post_id: post.id,
        payment_type: 'one_time',
        payment_status: 'success',
      },
    });

    if (purchase) {
      return true;
    }

    return false;
  }

  private async hasActiveSubscription(userId: number) {
    const subscription = await this.subscriptionModel.findOne({
      where: {
        user_id: userId,
        status: 'active',
      },
      order: [['id', 'DESC']],
    });

    if (!subscription) return false;

    if (!subscription.end_date) return true;

    return new Date(subscription.end_date) >= new Date();
  }

  private async hasPurchasedPost(userId: number, postId: number) {
    const purchase = await this.purchaseModel.findOne({
      where: {
        user_id: userId,
        post_id: postId,
        access_status: 'active',
      },
    });

    return !!purchase;
  }

  async myPosts(user: User) {
    return this.postModel.findAll({
      where: {
        author_id: user.id,
      },
      include: [
        { model: ContentMedia },
        {
          model: ContentPostCategory,
          include: [{ model: ContentCategory }],
        },
        {
          model: ContentPostTag,
          include: [{ model: ContentTag }],
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async updatePost(uuid: string, dto: any, user: User) {
    const post = await this.postModel.findOne({ where: { uuid } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!this.canEdit(post, user)) {
      throw new ForbiddenException('You cannot edit this post');
    }

    await post.update({
      title: dto.title ?? post.title,
      slug: dto.slug ?? post.slug,
      type: dto.type ?? post.type,
      visibility: dto.visibility ?? post.visibility,
      access_type: dto.access_type ?? post.access_type,
      excerpt: dto.excerpt ?? post.excerpt,
      content: dto.content ?? post.content,
      cover_image_url: dto.cover_image_url ?? post.cover_image_url,
      thumbnail_url: dto.thumbnail_url ?? post.thumbnail_url,
      banner_image_url: dto.banner_image_url ?? post.banner_image_url,
      price_amount: dto.price_amount ?? post.price_amount,
      currency: dto.currency ?? post.currency,
      status: dto.status ?? post.status,
      published_at:
        dto.status === 'published' && !post.published_at
          ? new Date()
          : (dto.published_at ?? post.published_at),
      target_level_id: dto.target_level_id ?? post.target_level_id,
    });

    return {
      message: 'Post updated successfully',
      post,
    };
  }

  async deletePost(uuid: string, user: User) {
    const post = await this.postModel.findOne({ where: { uuid } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!this.canEdit(post, user)) {
      throw new ForbiddenException('You cannot delete this post');
    }

    await post.destroy();

    return {
      message: 'Post deleted successfully',
    };
  }

  async createCategory(dto: any) {
    const slug = dto.slug || this.slugify(dto.name);

    const category = await this.categoryModel.create({
      uuid: uuidv4(),
      name: dto.name,
      slug,
      description: dto.description || null,
    });

    return {
      message: 'Category created successfully',
      category,
    };
  }

  async findCategories() {
    return this.categoryModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async createTag(dto: any) {
    const slug = dto.slug || this.slugify(dto.name);

    const tag = await this.tagModel.create({
      uuid: uuidv4(),
      name: dto.name,
      slug,
    });

    return {
      message: 'Tag created successfully',
      tag,
    };
  }

  async findTags() {
    return this.tagModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async addMedia(postUuid: string, dto: any, user: User) {
    const post = await this.postModel.findOne({
      where: { uuid: postUuid },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!this.canEdit(post, user)) {
      throw new ForbiddenException('You cannot add media to this post');
    }

    const media = await this.mediaModel.create({
      uuid: uuidv4(),
      post_id: post.id,
      media_type: dto.media_type || 'image',
      file_url: dto.file_url,
      thumbnail_url: dto.thumbnail_url || null,
      title: dto.title || null,
      sort_order: dto.sort_order || 1,
      is_featured: dto.is_featured || false,
    });

    return {
      message: 'Media added successfully',
      media,
    };
  }

  async toggleLike(postUuid: string, user: User) {
    const post = await this.postModel.findOne({ where: { uuid: postUuid } });

    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.likeModel.findOne({
      where: {
        user_id: user.id,
        post_id: post.id,
      },
    });

    if (existing) {
      await existing.destroy();
      return { message: 'Like removed', liked: false };
    }

    await this.likeModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      post_id: post.id,
    });

    return { message: 'Post liked', liked: true };
  }

  async toggleBookmark(postUuid: string, user: User) {
    const post = await this.postModel.findOne({ where: { uuid: postUuid } });

    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.bookmarkModel.findOne({
      where: {
        user_id: user.id,
        post_id: post.id,
      },
    });

    if (existing) {
      await existing.destroy();
      return { message: 'Bookmark removed', bookmarked: false };
    }

    await this.bookmarkModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      post_id: post.id,
    });

    return { message: 'Post bookmarked', bookmarked: true };
  }

  async addComment(postUuid: string, dto: any, user: User) {
    const post = await this.postModel.findOne({ where: { uuid: postUuid } });

    if (!post) throw new NotFoundException('Post not found');

    const comment = await this.commentModel.create({
      uuid: uuidv4(),
      post_id: post.id,
      user_id: user.id,
      parent_comment_id: dto.parent_comment_id || null,
      comment: dto.comment,
    });

    return {
      message: 'Comment added successfully',
      comment,
    };
  }

  async getComments(postUuid: string) {
    const post = await this.postModel.findOne({ where: { uuid: postUuid } });

    if (!post) throw new NotFoundException('Post not found');

    return this.commentModel.findAll({
      where: {
        post_id: post.id,
        parent_comment_id: null,
      },
      include: [
        { model: User },
        {
          model: ContentComment,
          as: 'replies',
          include: [{ model: User }],
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async myBookmarks(user: User) {
    return this.bookmarkModel.findAll({
      where: {
        user_id: user.id,
      },
      include: [{ model: ContentPost }],
      order: [['id', 'DESC']],
    });
  }

  async myLikes(user: User) {
    return this.likeModel.findAll({
      where: {
        user_id: user.id,
      },
      include: [{ model: ContentPost }],
      order: [['id', 'DESC']],
    });
  }

  async getSubscriptionPlans() {
    return this.subscriptionPlanModel.findAll({
      where: {
        is_active: true,
      },
      order: [['amount', 'ASC']],
    });
  }

  async createPostPurchaseOrder(postUuid: string, user: User) {
    const post = await this.postModel.findOne({
      where: {
        uuid: postUuid,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.status !== 'published') {
      throw new BadRequestException('Content is not published');
    }

    if (post.access_type === 'free' || post.visibility === 'free') {
      throw new BadRequestException('This content is already free');
    }

    if (post.access_type === 'subscription') {
      throw new BadRequestException('This content requires subscription');
    }

    const existingPurchase = await this.contentPaymentModel.findOne({
      where: {
        user_id: user.id,
        post_id: post.id,
        payment_type: 'one_time',
        payment_status: 'success',
      },
    });

    if (existingPurchase) {
      throw new BadRequestException('You already purchased this content');
    }

    const amount = Number(post.price_amount || 0);

    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid content price');
    }

    const order = await this.razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: post.currency || 'INR',
      receipt: `POST-${post.id}-${Date.now()}`,
      notes: {
        user_id: String(user.id),
        post_uuid: post.uuid,
        payment_type: 'one_time',
      },
    });

    const payment = await this.contentPaymentModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      subscription_id: null,
      subscription_plan_id: null,
      post_id: post.id,
      payment_type: 'one_time',
      amount,
      currency: post.currency || 'INR',
      provider: 'razorpay',
      provider_order_id: order.id,
      payment_status: 'pending',
      raw_response: order as any,
    });

    return {
      key: process.env.RAZORPAY_KEY_ID,
      order,
      payment_uuid: payment.uuid,
    };
  }

  async verifyPostPurchase(dto: VerifyContentPaymentDto, user: User) {
    const payment = await this.contentPaymentModel.findOne({
      where: {
        uuid: dto.payment_uuid,
        user_id: user.id,
        payment_type: 'one_time',
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.payment_status === 'success') {
      throw new BadRequestException('Payment already verified');
    }

    if (payment.provider_order_id !== dto.razorpay_order_id) {
      throw new BadRequestException('Order ID mismatch');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== dto.razorpay_signature) {
      await payment.update({
        payment_status: 'failed',
        failed_reason: 'Invalid Razorpay signature',
        raw_response: dto as any,
      });

      throw new BadRequestException('Invalid payment signature');
    }

    await payment.update({
      payment_status: 'success',
      provider_payment_id: dto.razorpay_payment_id,
      transaction_id: dto.razorpay_payment_id,
      provider_signature: dto.razorpay_signature,
      paid_at: new Date(),
      raw_response: dto as any,
    });

    return {
      message: 'Content unlocked successfully',
      payment,
    };
  }

  async createSubscriptionOrder(planUuid: string, user: User) {
    const plan = await this.subscriptionPlanModel.findOne({
      where: {
        uuid: planUuid,
        is_active: true,
      },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const activeSubscription = await this.subscriptionModel.findOne({
      where: {
        user_id: user.id,
        status: 'active',
        start_date: {
          [Op.lte]: new Date(),
        },
        end_date: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (activeSubscription) {
      throw new BadRequestException('You already have an active subscription');
    }

    const amount = Number(plan.amount);

    const order = await this.razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: plan.currency || 'INR',
      receipt: `SUB-${plan.id}-${Date.now()}`,
      notes: {
        user_id: String(user.id),
        plan_uuid: plan.uuid,
        payment_type: 'subscription',
      },
    });

    console.log(order, 'order');

    const payment = await this.contentPaymentModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      subscription_id: null,
      subscription_plan_id: plan.id,
      post_id: null,
      payment_type: 'subscription',
      amount,
      currency: plan.currency || 'INR',
      provider: 'razorpay',
      provider_order_id: order.id,
      payment_status: 'pending',
      raw_response: order as any,
    });

    return {
      key: process.env.RAZORPAY_KEY_ID,
      order,
      payment_uuid: payment.uuid,
      plan,
    };
  }

  async verifySubscriptionPayment(dto: VerifyContentPaymentDto, user: User) {
    const payment = await this.contentPaymentModel.findOne({
      where: {
        uuid: dto.payment_uuid,
        user_id: user.id,
        payment_type: 'subscription',
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.payment_status === 'success') {
      throw new BadRequestException('Payment already verified');
    }

    if (payment.provider_order_id !== dto.razorpay_order_id) {
      throw new BadRequestException('Order ID mismatch');
    }

    if (!payment.subscription_plan_id) {
      throw new BadRequestException('Subscription plan id missing in payment');
    }

    const plan = await this.subscriptionPlanModel.findOne({
      where: {
        id: payment.subscription_plan_id,
      },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== dto.razorpay_signature) {
      await payment.update({
        payment_status: 'failed',
        failed_reason: 'Invalid Razorpay signature',
        raw_response: dto as any,
      });

      throw new BadRequestException('Invalid payment signature');
    }

    const startDate = new Date();
    const endDate = new Date();

    if (Number(payment.amount) === 299) {
      endDate.setDate(endDate.getDate() + 30);
    } else if (Number(payment.amount) === 2999) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 100);
    }

    const subscription = await this.subscriptionModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      plan_name: plan.name,
      plan_type: plan.plan_type,
      amount: plan.amount,
      currency: plan.currency || 'INR',
      provider: 'razorpay',
      provider_payment_id: dto.razorpay_payment_id,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
    });

    await payment.update({
      subscription_id: subscription.id,
      payment_status: 'success',
      provider_payment_id: dto.razorpay_payment_id,
      transaction_id: dto.razorpay_payment_id,
      provider_signature: dto.razorpay_signature,
      paid_at: new Date(),
      raw_response: dto as any,
    });

    return {
      message: 'Subscription activated successfully',
      subscription,
      payment,
    };
  }

  async mySubscription(user: User) {
    const subscription = await this.subscriptionModel.findOne({
      where: {
        user_id: user.id,
        status: 'active',
        start_date: {
          [Op.lte]: new Date(),
        },
        end_date: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        {
          model: ContentPayment,
        },
      ],
      order: [['id', 'DESC']],
    });

    if (!subscription) {
      return {
        active: false,
        subscription: null,
      };
    }

    if (
      subscription &&
      subscription.end_date &&
      new Date(subscription.end_date) < new Date()
    ) {
      await subscription.update({
        status: 'expired',
        expired_at: new Date(),
      });

      return {
        active: false,
        subscription: null,
      };
    }

    return {
      active: true,
      subscription,
    };
  }

  async myContentPurchases(user: User) {
    return this.contentPaymentModel.findAll({
      where: {
        user_id: user.id,
        payment_status: 'success',
      },
      include: [
        {
          model: ContentPost,
        },
        {
          model: ContentSubscription,
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async cancelSubscription(dto: any, user: User) {
    const subscription = await this.subscriptionModel.findOne({
      where: {
        user_id: user.id,
        status: 'active',
      },
      order: [['id', 'DESC']],
    });

    if (!subscription) {
      throw new NotFoundException('Active subscription not found');
    }

    await subscription.update({
      status: 'cancelled',
      cancelled_at: new Date(),
      cancel_reason: dto.reason || 'Cancelled by user',
    });

    return {
      message: 'Subscription cancelled successfully',
      subscription,
    };
  }

  async expireOldSubscriptions() {
    const [count] = await this.subscriptionModel.update(
      {
        status: 'expired',
        expired_at: new Date(),
      },
      {
        where: {
          status: 'active',
          end_date: {
            [Op.lt]: new Date(),
          },
        },
      },
    );

    return {
      message: 'Expired subscriptions updated successfully',
      count,
    };
  }

  async refundPayment(paymentUuid: string, dto: any, user: User) {
    const payment = await this.contentPaymentModel.findOne({
      where: {
        uuid: paymentUuid,
        payment_status: 'success',
      },
      include: [
        {
          model: ContentSubscription,
        },
        {
          model: ContentPost,
        },
      ],
    });

    if (!payment) {
      throw new NotFoundException('Successful payment not found');
    }

    if (!payment.provider_payment_id) {
      throw new BadRequestException('Razorpay payment id not found');
    }

    try {
      await payment.update({
        payment_status: 'refund_pending',
        refund_reason: dto.reason || 'Refund initiated by admin',
      });

      const refund = await this.razorpay.payments.refund(
        payment.provider_payment_id,
        {
          amount: Math.round(Number(payment.amount) * 100),
          notes: {
            reason: dto.reason || 'Refund processed by admin',
            payment_uuid: payment.uuid,
            user_id: String(payment.user_id),
          },
        },
      );

      await payment.update({
        payment_status: 'refunded',
        provider_refund_id: refund.id,
        refunded_at: new Date(),
        refund_reason: dto.reason || 'Refund processed by admin',
        raw_response: {
          payment_response: payment.raw_response,
          refund_response: refund,
        },
      });

      if (payment.subscription_id) {
        await this.subscriptionModel.update(
          {
            status: 'refunded',
            cancelled_at: new Date(),
            cancel_reason: 'Refund processed by admin',
          },
          {
            where: {
              id: payment.subscription_id,
            },
          },
        );
      }

      if (payment.post_id) {
        await this.purchaseModel.update(
          {
            access_status: 'refunded',
          },
          {
            where: {
              payment_id: payment.id,
            },
          },
        );
      }

      return {
        message: 'Refund processed successfully',
        refund,
        payment,
      };
    } catch (error: any) {
      await payment.update({
        payment_status: 'refund_failed',
        failed_reason: error?.message || 'Refund failed',
      });

      throw new BadRequestException(error?.message || 'Refund failed');
    }
  }

  async recommendedContent(user: User) {
    const levelData = await this.progressService.getMyProgressLevel(user);
    const level = levelData.level;

    if (!level) {
      return {
        level: null,
        score: levelData.score,
        posts: [],
      };
    }

    const posts = await this.postModel.findAll({
      where: {
        status: 'published',
        [Op.or]: [{ target_level_id: level.id }, { target_level_id: null }],
      },
      include: [{ model: User, as: 'author' }, { model: ProgressLevel }],
      order: [['published_at', 'DESC']],
    });

    return {
      score: levelData.score,
      level,
      posts,
    };
  }
}
