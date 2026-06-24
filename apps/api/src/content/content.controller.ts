import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ContentService } from './content.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { VerifyContentPaymentDto } from './dto/verify-content-payment.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // PUBLIC
  @Get('posts')
  findPublishedPosts(
    @Query('type') type?: string,
    @Query('category') category?: string,
  ) {
    return this.contentService.findPublishedPosts(type, category);
  }

  @UseGuards(AuthTokenGuard)
  @Get('posts/:uuid')
  findPost(@Param('uuid') uuid: string, @Req() req: any) {
    return this.contentService.findPost(uuid, req.user || null);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get('posts/author/:uuid')
  findAuthorPost(@Param('uuid') uuid: string, @Req() req: any) {
    return this.contentService.findAuthorPost(uuid, req.user || null);
  }

  @Get('categories')
  findCategories() {
    return this.contentService.findCategories();
  }

  @Get('tags')
  findTags() {
    return this.contentService.findTags();
  }

  // DEVOTEE / ADMIN
  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post('posts')
  createPost(@Body() dto: any, @Req() req: any) {
    return this.contentService.createPost(dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get('my-posts')
  myPosts(@Req() req: any) {
    return this.contentService.myPosts(req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch('posts/:uuid')
  updatePost(@Param('uuid') uuid: string, @Body() dto: any, @Req() req: any) {
    return this.contentService.updatePost(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Delete('posts/:uuid')
  deletePost(@Param('uuid') uuid: string, @Req() req: any) {
    return this.contentService.deletePost(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post('categories')
  createCategory(@Body() dto: any) {
    return this.contentService.createCategory(dto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post('tags')
  createTag(@Body() dto: any) {
    return this.contentService.createTag(dto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post('posts/:uuid/media')
  addMedia(@Param('uuid') uuid: string, @Body() dto: any, @Req() req: any) {
    return this.contentService.addMedia(uuid, dto, req.user);
  }

  // LOGGED-IN USER ACTIONS
  @UseGuards(AuthTokenGuard)
  @Post('posts/:uuid/like')
  toggleLike(@Param('uuid') uuid: string, @Req() req: any) {
    return this.contentService.toggleLike(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('posts/:uuid/bookmark')
  toggleBookmark(@Param('uuid') uuid: string, @Req() req: any) {
    return this.contentService.toggleBookmark(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('posts/:uuid/comments')
  addComment(@Param('uuid') uuid: string, @Body() dto: any, @Req() req: any) {
    return this.contentService.addComment(uuid, dto, req.user);
  }

  @Get('posts/:uuid/comments')
  getComments(@Param('uuid') uuid: string) {
    return this.contentService.getComments(uuid);
  }

  @UseGuards(AuthTokenGuard)
  @Get('me/bookmarks')
  myBookmarks(@Req() req: any) {
    return this.contentService.myBookmarks(req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('me/likes')
  myLikes(@Req() req: any) {
    return this.contentService.myLikes(req.user);
  }

  @Get('subscriptions/plans')
  getSubscriptionPlans() {
    return this.contentService.getSubscriptionPlans();
  }

  @UseGuards(AuthTokenGuard)
  @Post('posts/:uuid/create-order')
  createPostPurchaseOrder(@Param('uuid') uuid: string, @Req() req: any) {
    return this.contentService.createPostPurchaseOrder(uuid, req.user);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AuthTokenGuard)
  @Post('posts/verify-payment')
  verifyPostPurchase(@Body() dto: VerifyContentPaymentDto, @Req() req: any) {
    return this.contentService.verifyPostPurchase(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('subscriptions/:planUuid/create-order')
  createSubscriptionOrder(
    @Param('planUuid') planUuid: string,
    @Req() req: any,
  ) {
    return this.contentService.createSubscriptionOrder(planUuid, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('subscriptions/verify-payment')
  verifySubscriptionPayment(
    @Body() dto: VerifyContentPaymentDto,
    @Req() req: any,
  ) {
    return this.contentService.verifySubscriptionPayment(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('my-subscription')
  mySubscription(@Req() req: any) {
    return this.contentService.mySubscription(req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('my-purchases')
  myContentPurchases(@Req() req: any) {
    return this.contentService.myContentPurchases(req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('subscriptions/cancel')
  cancelSubscription(@Body() dto: any, @Req() req: any) {
    return this.contentService.cancelSubscription(dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('payments/:paymentUuid/refund')
  refundPayment(
    @Param('paymentUuid') paymentUuid: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.contentService.refundPayment(paymentUuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('recommended')
  recommendedContent(@Req() req: any) {
    return this.contentService.recommendedContent(req.user);
  }
}
