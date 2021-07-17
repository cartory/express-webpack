import { Model } from 'sequelize'
import { Request, Response } from 'express'

export const defaultErrorMessage = {
    status: 500,
    message: '⚠️ Ups!, Something goes Wrong !!⚠️'
}

export class Controller {
    /**
     * Sequelize Model
     * @param {Model} model 
     */
    constructor(model) {
        this.model = model
    }

    /**
     * Fetch Data from Table as Rows
     * @param {Request} _ 
     * @param {Response} res
     */
    all = async (_, res) => {
        try {
            return res
                .status(200)
                .json(await this.model.findAll())
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json(defaultErrorMessage)
        }
    }

    /**
     * Fetch one Row from Table
     * @param {Request} req 
     * @param {Response} res 
     */
    find = async (req, res) => {
        try {
            return res
                .status(200)
                .json(await this.model.findOne({
                    where: { id: req.params.id }
                }))
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json(defaultErrorMessage)
        }
    }

    /**
     * Store/Update Row from DB
     * @param {Request} req 
     * @param {Response} res
     */
    save = async (req, res) => {
        try {
            return res
                .status(200)
                .json(await this.model.upsert(req.body))
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json(defaultErrorMessage)
        }
    }

    /**
     * Store Data to DB
     * @param {Request} req 
     * @param {Response} res 
     */
    store = async (req, res) => {
        try {
            return res
                .status(200)
                .json(await this.model.create(req.body))
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json(defaultErrorMessage)
        }
    }

    /**
     * Update Row from DB
     * @param {Request} req 
     * @param {Response} res 
     */
    update = async (req, res) => {
        try {
            return res
                .status(200)
                .json(await this.model.update(req.body, {
                    where: { id: req.params.id }
                }))
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json(defaultErrorMessage)
        }
    }

    /**
     * Destroy row from DB 
     * @param {Request} req 
     * @param {Response} res 
     */
    destroy = async (req, res) => {
        try {
            return res
                .status(200)
                .json(await this.model.destroy({
                    where: { id: req.params.id }
                }))
        } catch (error) {
            console.error(error);
            return res
                .status(500)
                .json(defaultErrorMessage)
        }
    }
}