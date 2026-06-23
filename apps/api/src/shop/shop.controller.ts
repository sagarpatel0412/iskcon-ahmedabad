// src/shop/shop.controller.ts

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

import { ShopService } from './shop.service';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { VerifiedDevoteeGuard } from '../auth/guards/verified-devotee.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const imageFileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return cb(new BadRequestException('Only image files are allowed'), false);
  }

  cb(null, true);
};

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  // CATEGORY

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post('categories')
  createCategory(@Body() dto: any, @Req() req: any) {
    return this.shopService.createCategory(dto, req.user);
  }

  @Get('categories')
  findCategories() {
    return this.shopService.findCategories();
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch('categories/:uuid')
  updateCategory(@Param('uuid') uuid: string, @Body() dto: any) {
    return this.shopService.updateCategory(uuid, dto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Delete('categories/:uuid')
  deleteCategory(@Param('uuid') uuid: string) {
    return this.shopService.deleteCategory(uuid);
  }

  // PRODUCTS

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post('products')
  createProduct(@Body() dto: any, @Req() req: any) {
    return this.shopService.createProduct(dto, req.user);
  }

  @Get('products')
  findProducts(@Query() query: any) {
    return this.shopService.findProducts(query);
  }

  @Get('products/:uuid')
  findProduct(@Param('uuid') uuid: string) {
    return this.shopService.findProduct(uuid);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch('products/:uuid')
  updateProduct(
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.shopService.updateProduct(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Delete('products/:uuid')
  deleteProduct(@Param('uuid') uuid: string, @Req() req: any) {
    return this.shopService.deleteProduct(uuid, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post('products/:uuid/images')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, _file, cb) => {
          const productUuid = req.params.uuid;
          const dir = `./uploads/shop/${productUuid}/images`;

          fs.mkdirSync(dir, { recursive: true });

          cb(null, dir);
        },
        filename: (_req, file, cb) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            extname(file.originalname);

          cb(null, uniqueName);
        },
      }),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadProductImage(
    @Param('uuid') uuid: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    return this.shopService.uploadProductImage(uuid, file, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Delete('product-images/:uuid')
  deleteProductImage(@Param('uuid') uuid: string, @Req() req: any) {
    return this.shopService.deleteProductImage(uuid, req.user);
  }

  // WISHLIST

  @UseGuards(AuthTokenGuard)
  @Post('wishlist/:productUuid/toggle')
  toggleWishlist(@Param('productUuid') productUuid: string, @Req() req: any) {
    return this.shopService.toggleWishlist(productUuid, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('wishlist/me')
  myWishlist(@Req() req: any) {
    return this.shopService.myWishlist(req.user);
  }

  // CART

  @UseGuards(AuthTokenGuard)
  @Get('cart/me')
  myCart(@Req() req: any) {
    return this.shopService.myCart(req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('cart/items')
  addToCart(@Body() dto: any, @Req() req: any) {
    return this.shopService.addToCart(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Patch('cart/items/:uuid')
  updateCartItem(
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.shopService.updateCartItem(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Delete('cart/items/:uuid')
  removeCartItem(@Param('uuid') uuid: string, @Req() req: any) {
    return this.shopService.removeCartItem(uuid, req.user);
  }

  // SHIPPING ADDRESSES

  @UseGuards(AuthTokenGuard)
  @Post('shipping-addresses')
  createShippingAddress(@Body() dto: any, @Req() req: any) {
    return this.shopService.createShippingAddress(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('shipping-addresses/me')
  myShippingAddresses(@Req() req: any) {
    return this.shopService.myShippingAddresses(req.user);
  }

  // ORDERS + PAYMENTS

  @UseGuards(AuthTokenGuard)
  @Post('orders')
  createOrder(@Body() dto: any, @Req() req: any) {
    return this.shopService.createOrder(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Post('orders/verify-payment')
  verifyPayment(@Body() dto: any, @Req() req: any) {
    return this.shopService.verifyPayment(dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('orders/me')
  myOrders(@Req() req: any) {
    return this.shopService.myOrders(req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE','ADMIN')
  @Get('orders')
  findAllOrders(@Query() query: any) {
    return this.shopService.findAllOrders(query);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE','ADMIN')
  @Patch('orders/:uuid/status')
  updateOrderStatus(
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.shopService.updateOrderStatus(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get('inventory-logs')
  findInventoryLogs(@Query() query: any) {
    return this.shopService.findInventoryLogs(query);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE','ADMIN')
  @Get('reports/summary')
  getReportsSummary() {
    return this.shopService.getReportsSummary();
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE','ADMIN')
  @Get('refunds')
  getRefunds(@Query() query: any) {
    return this.shopService.getRefunds(query);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE','ADMIN')
  @Post('orders/:uuid/refund')
  refundOrder(
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.shopService.refundOrder(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch('orders/:uuid/shipping')
  updateShipping(
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.shopService.updateShipping(uuid, dto, req.user);
  }

  @UseGuards(AuthTokenGuard)
  @Get('orders/me/:uuid')
  myOrderDetails(@Param('uuid') uuid: string, @Req() req: any) {
    return this.shopService.myOrderDetails(uuid, req.user);
  }

  // Coupons

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Post('coupons')
  createCoupon(@Body() dto: any, @Req() req: any) {
    return this.shopService.createCoupon(dto, req.user);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get('coupons')
  findCoupons(@Query() query: any) {
    return this.shopService.findCoupons(query);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch('coupons/:uuid')
  updateCoupon(@Param('uuid') uuid: string, @Body() dto: any) {
    return this.shopService.updateCoupon(uuid, dto);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Delete('coupons/:uuid')
  deleteCoupon(@Param('uuid') uuid: string) {
    return this.shopService.deleteCoupon(uuid);
  }

  @UseGuards(AuthTokenGuard)
  @Post('coupons/apply')
  applyCoupon(@Body() dto: any, @Req() req: any) {
    return this.shopService.applyCoupon(dto, req.user);
  }

  // Reviews

  @UseGuards(AuthTokenGuard)
  @Post('products/:uuid/reviews')
  createReview(
    @Param('uuid') uuid: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    return this.shopService.createReview(uuid, dto, req.user);
  }

  @Get('products/:uuid/reviews')
  findProductReviews(@Param('uuid') uuid: string) {
    return this.shopService.findProductReviews(uuid);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Get('reviews')
  findAllReviews(@Query() query: any) {
    return this.shopService.findAllReviews(query);
  }

  @UseGuards(AuthTokenGuard, RolesGuard, VerifiedDevoteeGuard)
  @Roles('DEVOTEE', 'ADMIN')
  @Patch('reviews/:uuid/status')
  updateReviewStatus(@Param('uuid') uuid: string, @Body() dto: any) {
    return this.shopService.updateReviewStatus(uuid, dto);
  }
}