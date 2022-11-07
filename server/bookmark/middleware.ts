import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BookmarkCollection from './collection';
import FreetCollection from '../freet/collection';

const isBookmarkExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const bookmark = validFormat ? await BookmarkCollection.findOne(req.session.userId, req.params.freetId) : '';
  if (!bookmark) {
    res.status(404).json({
      error: {
        bookmarkNotFound: `Bookmark for freet ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

const isFreetNotBookmarked = async (req: Request, res: Response, next: NextFunction) => {
  const userBookmarkedFreets = await BookmarkCollection.findAllByUser(req.session.userId);
  const userBookmarkedFreetIds = userBookmarkedFreets.map(bookmark => { return bookmark.freetId._id.toString() });
  if (userBookmarkedFreetIds.includes(req.body.freetId)) {
    res.status(403).json({
      error: 'Cannot bookmark freet that is already bookmarked by you.'
    });
    return;
  }

  next();
};

 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

const isValidTag = (req: Request, res: Response, next: NextFunction) => {
  const {tag} = req.query as {tag: string};

  if (tag.length == 0 || tag.length > 20) {
    res.status(413).json({
      error: 'Tag cannot be empty or more than 20 characters.'
    });
    return;
  }

  next();
};

export {
  isBookmarkExists,
  isFreetNotBookmarked,
  isFreetExists,
  isValidTag
};
