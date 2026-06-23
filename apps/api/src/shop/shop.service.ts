import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import { User } from '../users/user.model';

import { ProductCategory } from './models/product-category.model';
import { Product } from './models/product.model';
import { ProductImage } from './models/product-image.model';
import { Wishlist } from './models/wishlist.model';
import { Cart } from './models/cart.model';
import { CartItem } from './models/cart-item.model';
import { ShippingAddress } from './models/shipping-address.model';
import { ProductOrder } from './models/product-order.model';
import { ProductOrderItem } from './models/product-order-item.model';
import { ProductPayment } from './models/product-payment.model';
import { OrderStatusHistory } from './models/order-status-history.model';
import { ProductInventoryLog } from './models/product-inventory-log.model';
import Razorpay from 'razorpay';
import { ProductReview } from './models/product-review.model';
import { ShopCoupon } from './models/shop-coupon.model';
import { ShopCouponUsage } from './models/shop-coupon-usage.model';

@Injectable()
export class ShopService {
  private razorpay:Razorpay;
  constructor(
    @InjectModel(ProductCategory)
    private readonly categoryModel: typeof ProductCategory,

    @InjectModel(Product)
    private readonly productModel: typeof Product,

    @InjectModel(ProductImage)
    private readonly productImageModel: typeof ProductImage,

    @InjectModel(Wishlist)
    private readonly wishlistModel: typeof Wishlist,

    @InjectModel(Cart)
    private readonly cartModel: typeof Cart,

    @InjectModel(CartItem)
    private readonly cartItemModel: typeof CartItem,

    @InjectModel(ShippingAddress)
    private readonly shippingAddressModel: typeof ShippingAddress,

    @InjectModel(ProductOrder)
    private readonly orderModel: typeof ProductOrder,

    @InjectModel(ProductOrderItem)
    private readonly orderItemModel: typeof ProductOrderItem,

    @InjectModel(ProductPayment)
    private readonly paymentModel: typeof ProductPayment,

    @InjectModel(OrderStatusHistory)
    private readonly orderStatusHistoryModel: typeof OrderStatusHistory,

    @InjectModel(ProductInventoryLog)
    private readonly inventoryLogModel: typeof ProductInventoryLog,

    @InjectModel(ProductReview)
    private readonly reviewModel: typeof ProductReview,

    @InjectModel(ShopCoupon)
    private readonly couponModel: typeof ShopCoupon,

    @InjectModel(ShopCouponUsage)
    private readonly couponUsageModel: typeof ShopCouponUsage,
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
      .replace(/(^-|-$)+/g, '');
  }

  private isAdmin(user: User) {
    return (
      user.user_roles?.some((ur: any) => ur.role?.name === 'ADMIN') ?? false
    );
  }

  private canManageProduct(product: Product, user: User) {
    return product.created_by === user.id || this.isAdmin(user);
  }

  private createOrderNumber() {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  }

  // CATEGORY

  async createCategory(dto: any, user: User) {
    const slug = this.slugify(dto.name);

    const existing = await this.categoryModel.findOne({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Category already exists');
    }

    const category = await this.categoryModel.create({
      uuid: uuidv4(),
      centre_id: dto.centre_id || null,
      name: dto.name,
      slug,
      description: dto.description || null,
      image_url: dto.image_url || null,
      is_active: dto.is_active ?? true,
    });

    return {
      message: 'Category created successfully',
      category,
    };
  }

  async findCategories() {
    return this.categoryModel.findAll({
      where: {
        is_active: true,
      },
      order: [['name', 'ASC']],
    });
  }

  async updateCategory(uuid: string, dto: any) {
    const category = await this.categoryModel.findOne({
      where: { uuid },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    let slug = category.slug;

    if (dto.name && dto.name !== category.name) {
      slug = this.slugify(dto.name);

      const existing = await this.categoryModel.findOne({
        where: {
          slug,
          id: {
            [Op.ne]: category.id,
          },
        },
      });

      if (existing) {
        throw new BadRequestException('Category already exists');
      }
    }

    await category.update({
      centre_id: dto.centre_id ?? category.centre_id,
      name: dto.name ?? category.name,
      slug,
      description: dto.description ?? category.description,
      image_url: dto.image_url ?? category.image_url,
      is_active: dto.is_active ?? category.is_active,
    });

    return {
      message: 'Category updated successfully',
      category,
    };
  }

  async deleteCategory(uuid: string) {
    const category = await this.categoryModel.findOne({
      where: { uuid },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await category.destroy();

    return {
      message: 'Category deleted successfully',
    };
  }

  // PRODUCTS

  async createProduct(dto: any, user: User) {
    const slug = this.slugify(dto.title);

    const existing = await this.productModel.findOne({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Product slug already exists');
    }

    const category = await this.categoryModel.findByPk(dto.category_id);

    if (!category) {
      throw new BadRequestException('Invalid category');
    }

    const product = await this.productModel.create({
      uuid: uuidv4(),
      centre_id: dto.centre_id || null,
      category_id: dto.category_id,
      created_by: user.id,
      title: dto.title,
      slug,
      description: dto.description || null,
      sku: dto.sku || null,
      price_amount: dto.price_amount || 0,
      currency: dto.currency || 'INR',
      stock_quantity: dto.stock_quantity || 0,
      low_stock_alert: dto.low_stock_alert || 5,
      weight_grams: dto.weight_grams || null,
      is_featured: dto.is_featured || false,
      status: dto.status || 'draft',
    });

    await this.inventoryLogModel.create({
      uuid: uuidv4(),
      product_id: product.id,
      changed_by: user.id,
      change_type: 'add',
      quantity_change: product.stock_quantity,
      previous_quantity: 0,
      new_quantity: product.stock_quantity,
      note: 'Initial stock',
    });

    return {
      message: 'Product created successfully',
      product,
    };
  }

  async findProducts(query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 12);
    const offset = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    } else {
      where.status = 'published';
    }

    if (query.category_id) {
      where.category_id = Number(query.category_id);
    }

    if (query.category_uuid) {
      const category = await this.categoryModel.findOne({
        where: {
          uuid: query.category_uuid,
        },
      });

      if (category) {
        where.category_id = category.id;
      }
    }

    if (query.is_featured !== undefined) {
      where.is_featured = query.is_featured === 'true';
    }

    if (query.min_price || query.max_price) {
      where.price_amount = {};

      if (query.min_price) {
        where.price_amount[Op.gte] = Number(query.min_price);
      }

      if (query.max_price) {
        where.price_amount[Op.lte] = Number(query.max_price);
      }
    }

    if (query.in_stock === 'true') {
      where.stock_quantity = {
        [Op.gt]: 0,
      };
    }

    if (query.search?.trim()) {
      where[Op.or] = [
        { title: { [Op.like]: `%${query.search}%` } },
        { description: { [Op.like]: `%${query.search}%` } },
        { sku: { [Op.like]: `%${query.search}%` } },
      ];
    }

    const allowedSortFields = [
      'created_at',
      'price_amount',
      'title',
      'stock_quantity',
    ];

    const sortBy = allowedSortFields.includes(query.sort_by)
      ? query.sort_by
      : 'created_at';

    const sortOrder =
      query.sort_order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { rows, count } = await this.productModel.findAndCountAll({
      where,
      include: [
        {
          model: ProductCategory,
        },
        {
          model: ProductImage,
          separate: true,
          order: [
            ['is_primary', 'DESC'],
            ['sort_order', 'ASC'],
          ],
        },
        {
          model: User,
          as: 'creator',
          attributes: {
            exclude: ['password_hash'],
          },
        },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNextPage: page < Math.ceil(count / limit),
        hasPreviousPage: page > 1,
      },
      filters: {
        search: query.search || '',
        status: query.status || 'published',
        category_id: query.category_id || null,
        category_uuid: query.category_uuid || null,
        is_featured: query.is_featured ?? null,
        min_price: query.min_price || null,
        max_price: query.max_price || null,
        in_stock: query.in_stock || null,
        sort_by: sortBy,
        sort_order: sortOrder,
      },
    };
  }

  async findProduct(uuid: string) {
    const product = await this.productModel.findOne({
      where: { uuid },
      include: [
        ProductCategory,
        ProductImage,
        {
          model: User,
          as: 'creator',
          attributes: {
            exclude: ['password_hash'],
          },
        },
      ],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(uuid: string, dto: any, user: User) {
    const product = await this.productModel.findOne({
      where: { uuid },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!this.canManageProduct(product, user)) {
      throw new ForbiddenException('You cannot update this product');
    }

    let slug = product.slug;

    if (dto.title && dto.title !== product.title) {
      slug = this.slugify(dto.title);

      const existing = await this.productModel.findOne({
        where: {
          slug,
          id: {
            [Op.ne]: product.id,
          },
        },
      });

      if (existing) {
        throw new BadRequestException('Product slug already exists');
      }
    }

    const previousQuantity = product.stock_quantity;
    const newQuantity =
      dto.stock_quantity !== undefined
        ? Number(dto.stock_quantity)
        : product.stock_quantity;

    await product.update({
      centre_id: dto.centre_id ?? product.centre_id,
      category_id: dto.category_id ?? product.category_id,
      title: dto.title ?? product.title,
      slug,
      description: dto.description ?? product.description,
      sku: dto.sku ?? product.sku,
      price_amount: dto.price_amount ?? product.price_amount,
      currency: dto.currency ?? product.currency,
      stock_quantity: newQuantity,
      low_stock_alert: dto.low_stock_alert ?? product.low_stock_alert,
      weight_grams: dto.weight_grams ?? product.weight_grams,
      is_featured: dto.is_featured ?? product.is_featured,
      status: dto.status ?? product.status,
    });

    if (newQuantity !== previousQuantity) {
      await this.inventoryLogModel.create({
        uuid: uuidv4(),
        product_id: product.id,
        changed_by: user.id,
        change_type: 'manual_adjustment',
        quantity_change: newQuantity - previousQuantity,
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        note: 'Stock updated manually',
      });
    }

    return {
      message: 'Product updated successfully',
      product,
    };
  }

  async deleteProduct(uuid: string, user: User) {
    const product = await this.productModel.findOne({
      where: { uuid },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!this.canManageProduct(product, user)) {
      throw new ForbiddenException('You cannot delete this product');
    }

    await product.destroy();

    return {
      message: 'Product deleted successfully',
    };
  }

  async uploadProductImage(
    productUuid: string,
    file: Express.Multer.File,
    user: User,
  ) {
    const product = await this.productModel.findOne({
      where: { uuid: productUuid },
      include: [ProductImage],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!this.canManageProduct(product, user)) {
      throw new ForbiddenException('You cannot upload image for this product');
    }

    const imageUrl = `/uploads/shop/${product.id}/images/${file.filename}`;

    const existingImages = await this.productImageModel.count({
      where: {
        product_id: product.id,
      },
    });

    const image = await this.productImageModel.create({
      uuid: uuidv4(),
      product_id: product.id,
      image_url: imageUrl,
      sort_order: existingImages + 1,
      is_primary: existingImages === 0,
    });

    return {
      message: 'Product image uploaded successfully',
      image,
    };
  }

  async deleteProductImage(imageUuid: string, user: User) {
    const image = await this.productImageModel.findOne({
      where: { uuid: imageUuid },
      include: [Product],
    });

    if (!image || !image.product) {
      throw new NotFoundException('Product image not found');
    }

    if (!this.canManageProduct(image.product, user)) {
      throw new ForbiddenException('You cannot delete this image');
    }

    await image.destroy();

    return {
      message: 'Product image deleted successfully',
    };
  }

  // WISHLIST

  async toggleWishlist(productUuid: string, user: User) {
    const product = await this.productModel.findOne({
      where: { uuid: productUuid },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.wishlistModel.findOne({
      where: {
        user_id: user.id,
        product_id: product.id,
      },
    });

    if (existing) {
      await existing.destroy();

      return {
        message: 'Removed from wishlist',
        wishlisted: false,
      };
    }

    await this.wishlistModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      product_id: product.id,
    });

    return {
      message: 'Added to wishlist',
      wishlisted: true,
    };
  }

  async myWishlist(user: User) {
    return this.wishlistModel.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Product,
          include: [ProductCategory, ProductImage],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // CART

  async getOrCreateCart(user: User) {
    let cart = await this.cartModel.findOne({
      where: {
        user_id: user.id,
      },
    });

    if (!cart) {
      cart = await this.cartModel.create({
        uuid: uuidv4(),
        user_id: user.id,
      });
    }

    return cart;
  }

  async myCart(user: User) {
    const cart = await this.getOrCreateCart(user);

    return this.cartModel.findOne({
      where: {
        id: cart.id,
      },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              include: [ProductImage, ProductCategory],
            },
          ],
        },
      ],
    });
  }

  async addToCart(dto: any, user: User) {
    const product = await this.productModel.findOne({
      where: {
        uuid: dto.product_uuid,
        status: 'published',
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const quantity = Number(dto.quantity || 1);

    if (quantity <= 0) {
      throw new BadRequestException('Invalid quantity');
    }

    if (product.stock_quantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const cart = await this.getOrCreateCart(user);

    const existing = await this.cartItemModel.findOne({
      where: {
        cart_id: cart.id,
        product_id: product.id,
      },
    });

    if (existing) {
      const newQuantity = existing.quantity + quantity;

      if (product.stock_quantity < newQuantity) {
        throw new BadRequestException('Insufficient stock');
      }

      await existing.update({
        quantity: newQuantity,
      });

      return {
        message: 'Cart updated successfully',
      };
    }

    await this.cartItemModel.create({
      uuid: uuidv4(),
      cart_id: cart.id,
      product_id: product.id,
      quantity,
    });

    return {
      message: 'Added to cart successfully',
    };
  }

  async updateCartItem(itemUuid: string, dto: any, user: User) {
    const cart = await this.getOrCreateCart(user);

    const item = await this.cartItemModel.findOne({
      where: {
        uuid: itemUuid,
        cart_id: cart.id,
      },
      include: [Product],
    });

    if (!item || !item.product) {
      throw new NotFoundException('Cart item not found');
    }

    const quantity = Number(dto.quantity || 1);

    if (quantity <= 0) {
      throw new BadRequestException('Invalid quantity');
    }

    if (item.product.stock_quantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    await item.update({
      quantity,
    });

    return {
      message: 'Cart item updated successfully',
    };
  }

  async removeCartItem(itemUuid: string, user: User) {
    const cart = await this.getOrCreateCart(user);

    const item = await this.cartItemModel.findOne({
      where: {
        uuid: itemUuid,
        cart_id: cart.id,
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await item.destroy();

    return {
      message: 'Cart item removed successfully',
    };
  }

  // SHIPPING ADDRESS

  async createShippingAddress(dto: any, user: User) {
    if (dto.is_default) {
      await this.shippingAddressModel.update(
        {
          is_default: false,
        },
        {
          where: {
            user_id: user.id,
          },
        },
      );
    }

    const address = await this.shippingAddressModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      full_name: dto.full_name,
      phone: dto.phone,
      address_line_1: dto.address_line_1,
      address_line_2: dto.address_line_2 || null,
      landmark: dto.landmark || null,
      city: dto.city,
      state_code: dto.state_code || null,
      country_code: dto.country_code || 'IN',
      postal_code: dto.postal_code,
      is_default: dto.is_default || false,
    });

    return {
      message: 'Shipping address created successfully',
      address,
    };
  }

  async myShippingAddresses(user: User) {
    return this.shippingAddressModel.findAll({
      where: {
        user_id: user.id,
      },
      order: [['is_default', 'DESC']],
    });
  }

  // ORDER + PAYMENT

  async createOrder(dto: any, user: User) {
    const cart = await this.cartModel.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: CartItem,
          include: [Product],
        },
      ],
    });

    if (!cart || !cart.items?.length) {
      throw new BadRequestException('Cart is empty');
    }

    const address = await this.shippingAddressModel.findOne({
      where: {
        uuid: dto.shipping_address_uuid,
        user_id: user.id,
      },
    });

    if (!address) {
      throw new BadRequestException('Shipping address not found');
    }

    let subtotal = 0;

    for (const item of cart.items) {
      if (!item.product) continue;

      if (item.product.stock_quantity < item.quantity) {
        throw new BadRequestException(
          `${item.product.title} has insufficient stock`,
        );
      }

      subtotal += Number(item.product.price_amount) * item.quantity;
    }

    let couponId: number | null = null;
    let couponCode: string | null = null;
    let discountAmount = 0;

    if (dto.coupon_code) {
      const couponResult = await this.validateCoupon(dto.coupon_code, user, subtotal);

      couponId = couponResult.coupon.id;
      couponCode = couponResult.coupon.code;
      discountAmount = couponResult.discount_amount;
    }

    const shippingAmount = Number(dto.shipping_amount || 0);
    const totalAmount = subtotal + shippingAmount - discountAmount;


    const razorpayOrder = await this.razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: this.createOrderNumber(),
      notes: {
        user_id: String(user.id),
      },
    });

    const orderNumber = razorpayOrder.receipt || this.createOrderNumber();

    const order = await this.orderModel.create({
      uuid: uuidv4(),
      user_id: user.id,
      shipping_address_id: address.id,
      order_number: orderNumber,
      subtotal_amount: subtotal,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      currency: 'INR',
      payment_status: 'pending',
      order_status: 'pending',
      razorpay_order_id: razorpayOrder.id,
      razorpay_payment_id: null,
      coupon_id: couponId,
      coupon_code: couponCode,
      discount_amount: discountAmount,
    });

    for (const item of cart.items) {
      if (!item.product) continue;

      const primaryImage = await this.productImageModel.findOne({
        where: {
          product_id: item.product.id,
          is_primary: true,
        },
      });

      await this.orderItemModel.create({
        uuid: uuidv4(),
        order_id: order.id,
        product_id: item.product.id,
        product_title: item.product.title,
        product_image_url: primaryImage?.image_url || null,
        price_amount: item.product.price_amount,
        quantity: item.quantity,
        total_amount: Number(item.product.price_amount) * item.quantity,
      });
    }

    const payment = await this.paymentModel.create({
      uuid: uuidv4(),
      order_id: order.id,
      user_id: user.id,
      provider: 'razorpay',
      provider_order_id: razorpayOrder.id,
      provider_payment_id: null,
      provider_signature: null,
      amount: totalAmount,
      currency: 'INR',
      status: 'pending',
      raw_response: razorpayOrder,
    });

    return {
      message: 'Order created successfully',
      order,
      payment,
      razorpay: {
        key: process.env.RAZORPAY_KEY_ID,
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    };
  }

  // async verifyPayment(dto: any, user: User) {
  //   const order = await this.orderModel.findOne({
  //     where: {
  //       uuid: dto.order_uuid,
  //       user_id: user.id,
  //     },
  //     include: [ProductOrderItem],
  //   });

  //   if (!order) {
  //     throw new NotFoundException('Order not found');
  //   }

  //   const body =
  //     dto.razorpay_order_id + '|' + dto.razorpay_payment_id;

  //   const expectedSignature = crypto
  //     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
  //     .update(body)
  //     .digest('hex');

  //   if (expectedSignature !== dto.razorpay_signature) {
  //     throw new BadRequestException('Invalid payment signature');
  //   }

  //   await order.update({
  //     payment_status: 'success',
  //     order_status: 'confirmed',
  //     razorpay_order_id: dto.razorpay_order_id,
  //     razorpay_payment_id: dto.razorpay_payment_id,
  //   });

  //   await this.paymentModel.update(
  //     {
  //       provider_order_id: dto.razorpay_order_id,
  //       provider_payment_id: dto.razorpay_payment_id,
  //       provider_signature: dto.razorpay_signature,
  //       status: 'success',
  //       raw_response: dto,
  //     },
  //     {
  //       where: {
  //         order_id: order.id,
  //       },
  //     },
  //   );

  //   for (const item of order.items || []) {
  //     if (!item.product_id) continue;

  //     const product = await this.productModel.findByPk(item.product_id);

  //     if (!product) continue;

  //     const previousQuantity = product.stock_quantity;
  //     const newQuantity = previousQuantity - item.quantity;

  //     await product.update({
  //       stock_quantity: newQuantity,
  //       status: newQuantity <= 0 ? 'out_of_stock' : product.status,
  //     });

  //     await this.inventoryLogModel.create({
  //       uuid: uuidv4(),
  //       product_id: product.id,
  //       changed_by: user.id,
  //       change_type: 'sale',
  //       quantity_change: -item.quantity,
  //       previous_quantity: previousQuantity,
  //       new_quantity: newQuantity,
  //       note: `Order ${order.order_number}`,
  //     });
  //   }

  //   await this.cartItemModel.destroy({
  //     where: {
  //       cart_id: {
  //         [Op.in]: this.cartModel.sequelize!.literal(
  //           `(SELECT id FROM carts WHERE user_id = ${user.id})`,
  //         ) as any,
  //       },
  //     },
  //   });

  //   return {
  //     message: 'Payment verified successfully',
  //     order,
  //   };
  // }

  async verifyPayment(dto: any, user: User) {
    const order = await this.orderModel.findOne({
      where: {
        uuid: dto.order_uuid,
        user_id: user.id,
      },
      include: [ProductOrderItem],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const body = `${dto.razorpay_order_id}|${dto.razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== dto.razorpay_signature) {
      await order.update({
        payment_status: 'failed',
      });

      throw new BadRequestException('Invalid payment signature');
    }

    if (order.razorpay_order_id !== dto.razorpay_order_id) {
      throw new BadRequestException('Razorpay order mismatch');
    }

    await order.update({
      payment_status: 'success',
      order_status: 'confirmed',
      razorpay_payment_id: dto.razorpay_payment_id,
    });

    await this.paymentModel.update(
      {
        provider_payment_id: dto.razorpay_payment_id,
        provider_signature: dto.razorpay_signature,
        status: 'success',
        raw_response: dto,
      },
      {
        where: {
          order_id: order.id,
        },
      },
    );

    for (const item of order.items || []) {
      if (!item.product_id) continue;

      const product = await this.productModel.findByPk(item.product_id);
      if (!product) continue;

      const previousQuantity = product.stock_quantity;
      const newQuantity = previousQuantity - item.quantity;

      if (newQuantity < 0) {
        throw new BadRequestException(`${product.title} stock not available`);
      }

      await product.update({
        stock_quantity: newQuantity,
        status: newQuantity <= 0 ? 'out_of_stock' : product.status,
      });

      await this.inventoryLogModel.create({
        uuid: uuidv4(),
        product_id: product.id,
        changed_by: user.id,
        change_type: 'sale',
        quantity_change: -item.quantity,
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        note: `Order ${order.order_number}`,
      });
    }

    const cart = await this.cartModel.findOne({
      where: { user_id: user.id },
    });

    if (cart) {
      await this.cartItemModel.destroy({
        where: { cart_id: cart.id },
      });
    }

    if (order.coupon_id && Number(order.discount_amount) > 0) {
      await this.couponUsageModel.create({
        uuid: uuidv4(),
        coupon_id: order.coupon_id,
        user_id: user.id,
        order_id: order.id,
        discount_amount: order.discount_amount,
      });

      await this.couponModel.increment('used_count', {
        by: 1,
        where: { id: order.coupon_id },
      });
    }

    return {
      message: 'Payment verified successfully',
      order,
    };
  }

  async myOrders(user: User) {
    return this.orderModel.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        ProductOrderItem,
        ShippingAddress,
        ProductPayment,
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findAllOrders(query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const offset = (page - 1) * limit;

    const where: any = {};

    if (query.order_status) {
      where.order_status = query.order_status;
    }

    if (query.payment_status) {
      where.payment_status = query.payment_status;
    }

    const { rows, count } = await this.orderModel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password_hash'],
          },
        },
        ShippingAddress,
        ProductOrderItem,
        ProductPayment,
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async updateOrderStatus(orderUuid: string, dto: any, user: User) {
    const order = await this.orderModel.findOne({
      where: {
        uuid: orderUuid,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const oldStatus = order.order_status;
    const newStatus = dto.order_status;

    await order.update({
      order_status: newStatus,
    });

    await this.orderStatusHistoryModel.create({
      uuid: uuidv4(),
      order_id: order.id,
      changed_by: user.id,
      old_status: oldStatus,
      new_status: newStatus,
      note: dto.note || null,
    });

    return {
      message: 'Order status updated successfully',
      order,
    };
  }

  async findInventoryLogs(query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const offset = (page - 1) * limit;

    const { rows, count } = await this.inventoryLogModel.findAndCountAll({
      include: [
        Product,
        {
          model: User,
          as: 'changedBy',
          attributes: {
            exclude: ['password_hash'],
          },
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getReportsSummary() {
    const orders = await this.orderModel.findAll({
      include: [ProductOrderItem],
    });

    const successfulOrders = orders.filter(
      (order) => order.payment_status === 'success',
    );

    const totalRevenue = successfulOrders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0,
    );

    const pendingOrders = orders.filter(
      (order) => order.order_status === 'pending',
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.order_status === 'delivered',
    ).length;

    const refundedOrders = orders.filter(
      (order) => order.payment_status === 'refunded',
    ).length;

    return {
      total_orders: orders.length,
      successful_orders: successfulOrders.length,
      pending_orders: pendingOrders,
      delivered_orders: deliveredOrders,
      refunded_orders: refundedOrders,
      total_revenue: totalRevenue,
    };
  }

  async getRefunds(query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const offset = (page - 1) * limit;

    const { rows, count } = await this.orderModel.findAndCountAll({
      where: {
        payment_status: 'refunded',
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password_hash'],
          },
        },
        ProductOrderItem,
        ProductPayment,
      ],
      order: [['updated_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async refundOrder(orderUuid: string, dto: any, user: User) {
    const order = await this.orderModel.findOne({
      where: {
        uuid: orderUuid,
      },
      include: [ProductOrderItem, ProductPayment],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.payment_status !== 'success') {
      throw new BadRequestException('Only successful payments can be refunded');
    }

    if (!order.razorpay_payment_id) {
      throw new BadRequestException('Razorpay payment id missing');
    }

    const refundAmount = dto.amount
      ? Number(dto.amount)
      : Number(order.total_amount);

    if (refundAmount <= 0) {
      throw new BadRequestException('Invalid refund amount');
    }

    if (refundAmount > Number(order.total_amount)) {
      throw new BadRequestException('Refund amount cannot exceed order amount');
    }

    const razorpayRefund = await this.razorpay.payments.refund(
      order.razorpay_payment_id,
      {
        amount: Math.round(refundAmount * 100),
        notes: {
          order_uuid: order.uuid,
          order_number: order.order_number,
          reason: dto.reason || 'Refunded by temple admin',
          refunded_by: String(user.id),
        },
      },
    );

    await order.update({
      payment_status: 'refunded',
      order_status: 'cancelled',
    });

    await this.paymentModel.update(
      {
        status: 'refunded',
        raw_response: {
          refund: razorpayRefund,
          reason: dto.reason || 'Refunded by admin',
          refunded_by: user.id,
          refunded_at: new Date(),
        },
      },
      {
        where: {
          order_id: order.id,
        },
      },
    );

    for (const item of order.items || []) {
      if (!item.product_id) continue;

      const product = await this.productModel.findByPk(item.product_id);
      if (!product) continue;

      const previousQuantity = product.stock_quantity;
      const newQuantity = previousQuantity + item.quantity;

      await product.update({
        stock_quantity: newQuantity,
        status: product.status === 'out_of_stock' ? 'published' : product.status,
      });

      await this.inventoryLogModel.create({
        uuid: uuidv4(),
        product_id: product.id,
        changed_by: user.id,
        change_type: 'cancel_return',
        quantity_change: item.quantity,
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        note: dto.reason || `Refund for order ${order.order_number}`,
      });
    }

    await this.orderStatusHistoryModel.create({
      uuid: uuidv4(),
      order_id: order.id,
      changed_by: user.id,
      old_status: order.order_status,
      new_status: 'cancelled',
      note: dto.reason || 'Order refunded',
    });

    return {
      message: 'Order refunded successfully',
      refund: razorpayRefund,
      order,
    };
  }

  async updateShipping(orderUuid: string, dto: any, user: User) {
    const order = await this.orderModel.findOne({
      where: { uuid: orderUuid },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await order.update({
      courier_name: dto.courier_name || null,
      tracking_number: dto.tracking_number || null,
      tracking_url: dto.tracking_url || null,
      order_status: dto.order_status || order.order_status,
      shipped_at:
        dto.order_status === 'shipped' && !order.shipped_at
          ? new Date()
          : order.shipped_at,
      delivered_at:
        dto.order_status === 'delivered' && !order.delivered_at
          ? new Date()
          : order.delivered_at,
    });

    await this.orderStatusHistoryModel.create({
      uuid: uuidv4(),
      order_id: order.id,
      changed_by: user.id,
      old_status: order.order_status,
      new_status: dto.order_status || order.order_status,
      note: dto.note || 'Shipping details updated',
    });

    return {
      message: 'Shipping details updated successfully',
      order,
    };
  }

  async myOrderDetails(uuid: string, user: User) {
    const order = await this.orderModel.findOne({
      where: {
        uuid,
        user_id: user.id,
      },
      include: [
        ProductOrderItem,
        ShippingAddress,
        ProductPayment,
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async createCoupon(dto: any, user: User) {
    const code = dto.code.trim().toUpperCase();

    const existing = await this.couponModel.findOne({ where: { code } });

    if (existing) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = await this.couponModel.create({
      uuid: uuidv4(),
      code,
      title: dto.title,
      description: dto.description || null,
      discount_type: dto.discount_type,
      discount_value: Number(dto.discount_value),
      min_order_amount: Number(dto.min_order_amount || 0),
      max_discount_amount: dto.max_discount_amount
        ? Number(dto.max_discount_amount)
        : null,
      usage_limit: dto.usage_limit ? Number(dto.usage_limit) : null,
      used_count: 0,
      per_user_limit: dto.per_user_limit ? Number(dto.per_user_limit) : 1,
      start_at: dto.start_at ? new Date(dto.start_at) : null,
      end_at: dto.end_at ? new Date(dto.end_at) : null,
      is_active: dto.is_active ?? true,
      created_by: user.id,
    });

    return {
      message: 'Coupon created successfully',
      coupon,
    };
  }

  async findCoupons(query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const offset = (page - 1) * limit;

    const where: any = {};

    if (query.search?.trim()) {
      where[Op.or] = [
        { code: { [Op.like]: `%${query.search}%` } },
        { title: { [Op.like]: `%${query.search}%` } },
      ];
    }

    if (query.is_active !== undefined) {
      where.is_active = query.is_active === 'true';
    }

    const { rows, count } = await this.couponModel.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: { exclude: ['password_hash'] },
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async updateCoupon(uuid: string, dto: any) {
    const coupon = await this.couponModel.findOne({ where: { uuid } });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    await coupon.update({
      title: dto.title ?? coupon.title,
      description: dto.description ?? coupon.description,
      discount_type: dto.discount_type ?? coupon.discount_type,
      discount_value:
        dto.discount_value !== undefined
          ? Number(dto.discount_value)
          : coupon.discount_value,
      min_order_amount:
        dto.min_order_amount !== undefined
          ? Number(dto.min_order_amount)
          : coupon.min_order_amount,
      max_discount_amount:
        dto.max_discount_amount !== undefined
          ? Number(dto.max_discount_amount)
          : coupon.max_discount_amount,
      usage_limit:
        dto.usage_limit !== undefined ? Number(dto.usage_limit) : coupon.usage_limit,
      per_user_limit:
        dto.per_user_limit !== undefined
          ? Number(dto.per_user_limit)
          : coupon.per_user_limit,
      start_at: dto.start_at ? new Date(dto.start_at) : coupon.start_at,
      end_at: dto.end_at ? new Date(dto.end_at) : coupon.end_at,
      is_active: dto.is_active ?? coupon.is_active,
    });

    return {
      message: 'Coupon updated successfully',
      coupon,
    };
  }

  async deleteCoupon(uuid: string) {
    const coupon = await this.couponModel.findOne({ where: { uuid } });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    await coupon.destroy();

    return {
      message: 'Coupon deleted successfully',
    };
  }

  async validateCoupon(code: string, user: User, subtotal: number) {
    const coupon = await this.couponModel.findOne({
      where: {
        code: code.trim().toUpperCase(),
        is_active: true,
      },
    });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon');
    }

    const now = new Date();

    if (coupon.start_at && coupon.start_at > now) {
      throw new BadRequestException('Coupon is not active yet');
    }

    if (coupon.end_at && coupon.end_at < now) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (subtotal < Number(coupon.min_order_amount || 0)) {
      throw new BadRequestException(
        `Minimum order amount should be ₹${coupon.min_order_amount}`,
      );
    }

    const userUsageCount = await this.couponUsageModel.count({
      where: {
        coupon_id: coupon.id,
        user_id: user.id,
      },
    });

    if (userUsageCount >= Number(coupon.per_user_limit || 1)) {
      throw new BadRequestException('You have already used this coupon');
    }

    let discount = 0;

    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * Number(coupon.discount_value)) / 100;

      if (coupon.max_discount_amount) {
        discount = Math.min(discount, Number(coupon.max_discount_amount));
      }
    } else {
      discount = Number(coupon.discount_value);
    }

    discount = Math.min(discount, subtotal);

    return {
      coupon,
      discount_amount: Number(discount.toFixed(2)),
    };
  }

  async applyCoupon(dto: any, user: User) {
    const cart = await this.myCart(user);
    const items = cart?.items || [];

    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + Number(item.product?.price_amount || 0) * Number(item.quantity || 0);
    }, 0);

    const result = await this.validateCoupon(dto.code, user, subtotal);

    return {
      message: 'Coupon applied successfully',
      code: result.coupon.code,
      discount_amount: result.discount_amount,
      subtotal,
      total_after_discount: subtotal - result.discount_amount,
    };
  }

  async createReview(productUuid: string, dto: any, user: User) {
    const product = await this.productModel.findOne({
      where: { uuid: productUuid },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const rating = Number(dto.rating);

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const existing = await this.reviewModel.findOne({
      where: {
        product_id: product.id,
        user_id: user.id,
      },
    });

    if (existing) {
      throw new BadRequestException('You already reviewed this product');
    }

    const purchased = await this.orderItemModel.findOne({
      where: {
        product_id: product.id,
      },
      include: [
        {
          model: ProductOrder,
          where: {
            user_id: user.id,
            payment_status: 'success',
          },
        },
      ],
    });

    const review = await this.reviewModel.create({
      uuid: uuidv4(),
      product_id: product.id,
      user_id: user.id,
      order_id: purchased?.order_id || null,
      rating,
      review_text: dto.review_text || null,
      status: 'approved',
    });

    return {
      message: 'Review submitted successfully',
      review,
    };
  }

  async findProductReviews(productUuid: string) {
    const product = await this.productModel.findOne({
      where: { uuid: productUuid },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const reviews = await this.reviewModel.findAll({
      where: {
        product_id: product.id,
        status: 'approved',
      },
      include: [
        {
          model: User,
          attributes: ['id', 'uuid', 'first_name', 'last_name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const avgRating =
      reviews.length === 0
        ? 0
        : reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

    return {
      reviews,
      summary: {
        total_reviews: reviews.length,
        average_rating: Number(avgRating.toFixed(1)),
      },
    };
  }

  async findAllReviews(query: any) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 20);
    const offset = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    const { rows, count } = await this.reviewModel.findAndCountAll({
      where,
      include: [
        Product,
        {
          model: User,
          attributes: { exclude: ['password_hash'] },
        },
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async updateReviewStatus(uuid: string, dto: any) {
    const review = await this.reviewModel.findOne({ where: { uuid } });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await review.update({
      status: dto.status,
    });

    return {
      message: 'Review status updated successfully',
      review,
    };
  }
}