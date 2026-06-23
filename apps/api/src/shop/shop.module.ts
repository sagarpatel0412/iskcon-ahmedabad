import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

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
import { AuthToken } from 'src/auth/auth-token.model';
import { ProductReview } from './models/product-review.model';
import { ShopCoupon } from './models/shop-coupon.model';
import { ShopCouponUsage } from './models/shop-coupon-usage.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductCategory,
      Product,
      ProductImage,
      Wishlist,
      Cart,
      CartItem,
      ShippingAddress,
      ProductOrder,
      ProductOrderItem,
      ProductPayment,
      OrderStatusHistory,
      ProductInventoryLog,
      ProductReview,
      ShopCoupon,
      ShopCouponUsage,
      AuthToken
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}