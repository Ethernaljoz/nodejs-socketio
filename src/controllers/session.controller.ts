import { OK } from "../constants/httpCode"
import SessionModel from "../models/session.model"
import { appAssert } from "../utils/AppError"
import catchErrors from "../utils/catchErrors"

export const getSessionHandler = catchErrors(
    async (req, res) => {
        const sessions = await SessionModel.find({
            userId: req.userId, expiresAt: { $gt: new Date() }
        }, {
            _id: 1, userAgent: 1, createdAt: 1
        }, {
            sort: { createdAt: -1 }
        })
        
        return res.status(OK).json(sessions.map((session) => ({
            ...session.toObject(),
            ...(session.id === req.sessionId && { isCurrent: true })
        })
        ))
    })