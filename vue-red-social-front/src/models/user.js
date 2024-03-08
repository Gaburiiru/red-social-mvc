class User {
  constructor(name, pass, img, follower, following, id) {
    this.name = name;
    this.pass = pass;
    this.img = img;
    this.follower = follower;
    this.following = following;
    this.id = id;
  }

  static fromJson({ name, pass, img, follower, following, id }) {
    return new User(name, pass, img, follower, following, id);
  }
}
export default User;
