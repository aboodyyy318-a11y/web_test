import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './schema/product.schema.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  // Create
  async create(createProductDto: CreateProductDto) {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  // Read all
  async findAll() {
    return this.productModel.find().exec();
  }

  // Read one
  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }

    return product;
  }

  // Update
  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }

    return product;
  }

  // Delete
  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).exec();

    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }

    return product;
  }
}
