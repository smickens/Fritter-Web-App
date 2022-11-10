import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from './collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a post is liked by the current user
 */
const isLiked = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.freetId);
    const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.params.freetId) : '';
    if (!like) {
      res.status(403).json({
        error: `Like does not exist.`
      });
      return;
    }
  
    next();
};

/**
 * Checks if a post is not liked by the current user
 */
const isNotLiked = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.freetId);
    const like = validFormat ? await LikeCollection.findOne(req.session.userId, req.body.freetId) : '';
    if (like) {
      res.status(403).json({
        error: `Like already exists.`
      });
      return;
    }
  
    next();
};

/**
 * Checks if a freetId in req.body is valid, that is, it matches the username regex
 */
 const isValidFreetId = (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  if (!validFormat) {
    res.status(400).json({
      error: 'FreetId must be of type objectId.'
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.params exists
 */
 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.body.freetId);
    const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
    if (!freet) {
      res.status(404).json({
        error: `Freet with freet ID ${req.body.freetId} does not exist.`
      });
      return;
    }
  
    next();
  };

export {
  isLiked,
  isNotLiked,
  isValidFreetId,
  isFreetExists
};