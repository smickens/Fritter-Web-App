import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TagCollection from './collection';
import BookmarkCollection from '../bookmark/collection';
import * as tagValidator from './middleware';
import * as userValidator from '../user/middleware';
import * as bookmarkValidator from '../bookmark/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the tags for bookmark for freetId
 *
 * @name GET /api/bookmarks/:freetId/tag
 *
 * @return {TagResponse[]} - A list of all the bookmarks sorted in descending order by date created
 * @throws {403} - If user is not logged in
 * @throws {404} - If the bookmarkId is not valid
 */
router.get(
  '/:freetId/tags',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isBookmarkExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const bookmark = await BookmarkCollection.findOne(req.session.userId, req.params.freetId);
    const bookmarkTags = await TagCollection.findAllByBookmark(bookmark._id);
    const response = bookmarkTags.map(util.constructTagResponse);
    res.status(200).json(response);
  } 
);

/**
 * Add a tag to a bookmark
 *
 * @name POST /api/bookmarks/:freetId/tags
 *
 * @param {string} tag - the new tag for the bookmark
 * @return {BookmarkResponse} - the updated bookmark
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the bookmarkId is not valid
 * @throws {400} - If newTag is in the wrong format or missing in the req
 * @throws {403} - If newTag is currently a tag associated with the bookmark
 */
router.post(
  '/:freetId/tags',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isBookmarkExists,
    tagValidator.isValidTag,
    tagValidator.notContainsTag
  ],
  async (req: Request, res: Response) => {
    const bookmark = await BookmarkCollection.findOne(req.session.userId, req.params.freetId);
    const tag = await TagCollection.addOne(bookmark._id, req.body.tag);

    res.status(201).json({
      message: 'Your tag was created successfully.',
      bookmark: util.constructTagResponse(tag)
    });
  }
);

/**
 * Remove a tag off a bookmark
 *
 * @name DELETE /api/bookmarks/:freetId/tags/:tag
 *
 * @param {string} tag - the tag to remove from the bookmark
 * @return {BookmarkResponse} - the updated bookmark
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the bookmarkId or tag is not valid
 * @throws {403} - If tag is not currently a tag associated with the bookmark
 */
 router.delete(
    '/:freetId/tags/:tag',
    [
      userValidator.isUserLoggedIn,
      bookmarkValidator.isBookmarkExists,
      tagValidator.containsTag
    ],
    async (req: Request, res: Response) => {
      const bookmark = await BookmarkCollection.findOne(req.session.userId, req.params.freetId);
      await TagCollection.deleteOne(bookmark._id, req.params.tag);
      res.status(200).json({
      message: 'Your tag was deleted successfully.'
      });
    }
  );

export {router as tagRouter};
