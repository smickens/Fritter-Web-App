import type {HydratedDocument, Types} from 'mongoose';
import type {Bookmark} from './model';
import BookmarkModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore bookmarks
 * stored in MongoDB, including adding, finding, updating, and deleting bookmarks.
 * Feel free to add additional operations in this file.
 */
class BookmarkCollection {
  /**
   * Add a bookmark to the collection
   *
   * @param {string} userId - The id of the user
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created bookmark
   */
  static async addOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    const date = new Date();
    const bookmark = new BookmarkModel({
      userId,
      freetId,
      dateCreated: date
    });
    await bookmark.save(); // Saves bookmark to MongoDB
    return bookmark.populate('freetId');
  }

  /**
   * Find a bookmark by userId and freetId
   *
   * @param {string} userId - The id of the user
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Bookmark>> | Promise<null> } - The bookmark with the given bookmarkId, if any
   */
   static async findOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    return BookmarkModel.findOne({userId: userId, freetId: freetId})
              .populate({
                path: 'freetId',
                populate: {
                  path: 'likedBy',
                  populate: {
                    path: 'userId'
                  }
                }
              })
              .populate({
                path: 'freetId',
                populate: {
                  path: 'authorId'
                }
              })
              .populate('tags')
              .exec();
  }

  /**
   * Get all the bookmarks by a given userId
   *
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks for this user
   */
  static async findAllByUser(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Bookmark>>> {
    return BookmarkModel.find({userId: userId}).sort({dateCreated: -1})
              .populate({
                path: 'freetId',
                populate: {
                  path: 'likedBy',
                  populate: {
                    path: 'userId'
                  }
                }
              })
              .populate({
                path: 'freetId',
                populate: {
                  path: 'authorId'
                }
              })
              .populate('tags')
              .exec();
  }

  /**
   * Get all the bookmarks by a given userId
   *
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks for this user
   */
  static async findAllByFreet(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Bookmark>>> {
    return BookmarkModel.find({freetId: freetId}).sort({dateCreated: -1})
              .populate({
                path: 'freetId',
                populate: {
                  path: 'likedBy',
                  populate: {
                    path: 'userId'
                  }
                }
              })
              .populate({
                path: 'freetId',
                populate: {
                  path: 'authorId'
                }
              })
              .populate('tags')
              .exec();
  }

  /**
   * Get all the bookmarks by a given userId
   *
   * @param {string} userId - The userId of the user
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks for this user
   */
  static async findAllByUserWithTag(userId: Types.ObjectId | string, tagName: string): Promise<Array<HydratedDocument<Bookmark>>> {
    const bookmarkByUser = this.findAllByUser(userId);
    return (await bookmarkByUser).filter(bookmark => { 
      const bookmarkTags = bookmark.tags.map(tag => { return tag.name });
      return bookmarkTags.includes(tagName);
    });
  }

  /**
   * Delete a bookmark for user with id for freet with freetId
   *
   * @param {string} userId - The userId of the user
   * @param {string} freetId - The freet id to delete bookmark for
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const bookmark = await BookmarkModel.deleteOne({userId: userId, freetId: freetId});
    return bookmark !== null;
  }

  /**
   * Delete all the bookmarks by the given user
   *
   * @param {string} userId - The id of user to delete all bookmarks for
   */
  static async deleteManyByUserId(userId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({userId: userId});
  }

  /**
   * Delete all the bookmarks for the given freet
   *
   * @param {string} freetId - The id of freet to delete all bookmarks for
   */
  static async deleteManyByFreetId(freetId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({freetId: freetId});
  }
}

export default BookmarkCollection;
