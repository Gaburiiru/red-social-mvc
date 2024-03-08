class Coment {
  constructor(postId, userId, coment, id) {
    this.postId = postId;
    this.userId = userId;
    this.coment = coment;
    this.id = id;
  }

  static fromJson({ postId, userId, coment, id }) {
    return new Coment(postId, userId, coment, id);
  }
}
export default Coment;
