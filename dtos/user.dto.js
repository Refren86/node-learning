module.exports = class UserDto {
  constructor(userModel) {
    this._id = userModel._id;
    this.name = userModel.name;
    this.age = userModel.age;
    this.email = userModel.email;
    this.avatar = userModel.avatar;
    this.cars = userModel.cars;
    this.createdAt = userModel.createdAt;
    this.updatedAt = userModel.updatedAt;
  }
}