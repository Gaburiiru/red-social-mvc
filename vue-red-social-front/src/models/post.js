class Post {
  constructor(userId, img, title, description, like, id) {
    this.userId = userId;
    this.img = img;
    this.title = title;
    this.description = description;
    this.like = like;
    this.id = id;
  }

  static fromJson({ userId, img, title, description, like, id }) {
    return new Post(userId, img, title, description, like, id);
  }
}
export default Post;