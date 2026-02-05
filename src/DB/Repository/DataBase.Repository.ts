import { Injectable } from "@nestjs/common";
import { FilterQuery, Model, PopulateOptions, UpdateQuery } from "mongoose";
import { FindOptions } from "src/common/types/types";




@Injectable()
export abstract class DataBaseRepository<TDocument> {
    constructor(private readonly model: Model<TDocument>) { }

    async create(data: Partial<TDocument>): Promise<TDocument> {
        return await this.model.create(data);
    }

    async find({ filter = {}, populate = [], page = 1, sort = "", select = "" }: FindOptions<TDocument>): Promise<TDocument[] | []> {
        const query = this.model.find(filter);
        if (populate) query.populate(populate)
        if (select) query.select(select.replaceAll(",", " "))
        if (sort) query.sort(sort.replaceAll(",", " "))
        if (!page) {
            return await query;
        }
        const limit: number = 10
        const skip = (page - 1) * limit
        const result = await query.skip(skip).limit(limit)

        return result

    }

    async findOne(query: FilterQuery<TDocument>, populate?: PopulateOptions[] | PopulateOptions): Promise<TDocument | null> {
        return await this.model.findOne(query).populate(populate || []).exec();
    }

    async findAll(query: FilterQuery<TDocument>, populate?: PopulateOptions[] | PopulateOptions): Promise<TDocument[] | null> {
        return await this.model.find(query).populate(populate || []).exec();
    }

    async findOneAndUpdate(query: FilterQuery<TDocument>, data: UpdateQuery<TDocument>): Promise<TDocument | null> {
        return await this.model.findOneAndUpdate(query, data, { new: true })
    }

    async findOneAndDelete(query: FilterQuery<TDocument>): Promise<TDocument | null> {
        return await this.model.findByIdAndDelete(query)
    }

}