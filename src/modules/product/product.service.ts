import { BadRequestException, Injectable } from '@nestjs/common';
import { BrandRepository, categoryRepositoryService, productRepository, SubCategoryRepository } from "../../DB/Repository";
import { createProductDto, ProductFilterDto, updateProductDto } from './Dto/productDto';
import { ProductDocument, user } from "../../DB/Model";
import { FilterQuery, Types } from 'mongoose';
import { _productData } from "../../common/types/types";
import { CloudinaryService } from "../../common/services";
import { AiService } from "../../common/services/ai.service";




@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: productRepository,
        private readonly brandRepository: BrandRepository,
        private readonly categoryRepository: categoryRepositoryService,
        private readonly subCategoryRepository: SubCategoryRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly aiService: AiService

    ) { }

    async createProduct(
        body: createProductDto,
        files: { subImages: Express.Multer.File[]; mainImage: Express.Multer.File },
        user: user,
    ): Promise<object> {

        const { name, description, category, subCategory, brand, price, discount, stock, quantity } = body;

        const [findCategory, findSubCategory, findBrand] = await Promise.all([
            this.categoryRepository.findOne({ _id: category }),
            this.subCategoryRepository.findOne({ _id: subCategory }),
            this.brandRepository.findOne({ _id: brand })
        ])

        if (!findCategory) throw new BadRequestException('Category not found');
        if (!findSubCategory) throw new BadRequestException('SubCategory not found');
        if (!findBrand) throw new BadRequestException('Brand not found');

        const subPrice = (price as number) - (price as number) * ((discount || 0) / 100);
        const customId = Math.random().toString(36).substring(2, 15);
        let productData: _productData = {
            name: name as string,
            description: description as string,
            price: price as number,
            discount: discount as number,
            quantity: quantity as number,
            stock: stock as number,
            userId: user._id,
            brand: new Types.ObjectId(brand),
            category: new Types.ObjectId(category),
            subCategory: new Types.ObjectId(subCategory),
            customId,
            subPrice,
        };
        const result = await this.cloudinaryService.UploadFiles(files.subImages, {
            folder: `${process.env.CLOUDINARY_FOLDER}/Category/${findCategory.customId}/subCategory/${findSubCategory.customId}/Brand/${findBrand.customId}/Product/${customId}`,
        });
        const mainImage = await this.cloudinaryService.UploadFile(
            files.mainImage[0],
            {
                folder: `${process.env.CLOUDINARY_FOLDER}/Products/${customId}/coverImage`,
            },
        );
        productData = {
            ...productData,
            subImages: [...result],
            mainImage: {
                secure_url: mainImage['secure_url'] as string,
                public_id: mainImage['public_id'] as string,
            },
        };
        const product = await this.productRepository.create(productData);
        if (!product) throw new BadRequestException('Failed to create category');
        return {
            message: 'done',
            data: product
        };
    }

    async updateProduct(
        body: updateProductDto,
        files: { subImages: Express.Multer.File[]; mainImage: Express.Multer.File },
        user: user,
        productId: Types.ObjectId
    ): Promise<object> {
        const { name, description, category, subCategory, brand, price, discount, stock, quantity } = body;

        const findproduct = await this.productRepository.findOne({ _id: productId, userId: user._id })
        if (!findproduct) {
            throw new BadRequestException('Product Not found or you are not authorized')
        }
        const findBrand = await this.brandRepository
            .findOne({ _id: brand },
                {
                    path: 'subCategoryId',
                    populate: {
                        path: 'categoryId',
                        model: 'Category'
                    }
                })

        if (!findBrand) throw new BadRequestException('Brand not found')
        if (!findBrand.subCategoryId) throw new BadRequestException('SubCategory not found')
        if (!findBrand.subCategoryId[0]['categoryId']) throw new BadRequestException('Category not found')


        if (name) {
            if (findproduct.name == name.toLowerCase()) {
                throw new BadRequestException('the same name plz change it')
            }
            findproduct.name = name
        }

        if (description) {
            findproduct.description = description
        }

        if (files.mainImage) {
            await this.cloudinaryService.DeleteImage(findproduct.mainImage['public_id'])
            const { secure_url, public_id } = await this.cloudinaryService.UploadFile(files.mainImage[0],
                { folder: `${process.env.CLOUDINARY_FOLDER}/Products/${findproduct.customId}/coverImage` }
            )
            findproduct.mainImage = { secure_url, public_id }
        }

        let subImages: { secure_url: string, public_id: string }[] = []
        if (files.subImages) {
            await this.cloudinaryService.DeleteImages(`${process.env.CLOUDINARY_FOLDER}/Category/${findBrand.subCategoryId[0]['categoryId'].customId}/subCategory/${findBrand.subCategoryId[0]['customId']}/Brand/${findBrand.customId}/Product/${findproduct.customId}`)
            const result = await this.cloudinaryService.UploadFiles(files.subImages,
                { folder: `${process.env.CLOUDINARY_FOLDER}/Category/${findBrand.subCategoryId[0]['categoryId'].customId}/subCategory/${findBrand.subCategoryId[0]['customId']}/Brand/${findBrand.customId}/Product/${findproduct.customId}` }
            )
            subImages.push(...result)
            findproduct.subImages = subImages
        }

        if (price && discount) {
            findproduct.subPrice = price - (price * ((discount || 0) / 100))
            findproduct.discount = discount
            findproduct.price = price
        }
        else if (price) {
            findproduct.subPrice = (price * ((findproduct.discount || 0) / 100))
            findproduct.price = price
        } else if (discount) {
            findproduct.subPrice = (findproduct.price * ((discount || 0) / 100))
            findproduct.discount = discount
        }

        if (quantity) {
            findproduct.quantity = quantity
        }

        if (stock) {
            if (stock > quantity) {
                throw new BadRequestException('stock should be less than quantity')
            }
            findproduct.stock = stock
        }

        await findproduct.save()

        return { findproduct }
    }

    async getAllProducts(
        query: ProductFilterDto
    ) {

        const { name, select, sort, page, category, brand } = query

        let filterObject: FilterQuery<ProductDocument> = {}
        if (name) {
            filterObject = {
                $or: [
                    { name: { $regex: name, $options: 'i' } },
                    { slug: { $regex: name, $options: 'i' } }
                ]
            }
        }
        if (category) {
            filterObject = {
                ...filterObject,
                category: new Types.ObjectId(category)
            }
        }
        if (brand) {
            filterObject = {
                ...filterObject,
                brand: new Types.ObjectId(brand)
            }
        }
        const products = await this.productRepository.find({
            filter: filterObject,
            populate: [{ path: 'category' }, { path: 'brand' }],
            select,
            sort,
            page
        })
        return products
    }

    async askAi(
        prompt: string
    ) {
        if (!prompt) return { message: 'Please provide a prompt' };

        const products = await this.getAllProducts({});

        const aiResponse = await this.aiService.askWithProducts(prompt, products);

        return { prompt, response: aiResponse };
    }

    async getproduct(
        productId: Types.ObjectId,
    ): Promise<object> {
        const product = await this.productRepository.findOne({ _id: productId }, [{ path: 'category' }, { path: 'brand' }])
        if (!product) {
            throw new BadRequestException('order not found')
        }

        return (product)
    }

}
