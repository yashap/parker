import { NextFunction, Request, Response } from 'express'

export type FunctionalErrorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => void
