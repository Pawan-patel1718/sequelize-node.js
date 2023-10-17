const baseUrl = process.env.baseUrl;

function getFullImageUrlArray(userList) {
  return userList.map((user) => {
    const storedPaths = user.profile_image.split(',');
    const fullUrls = storedPaths.map((path) => baseUrl + path);

    // Create a new object with full URLs for profile_image
    return {
      ...user.toJSON(),
      profile_image: fullUrls
    };
  });
}

function getFullImageUrl(userList) {
  const storedPaths = userList.profile_image.split(',');
  const fullUrls = storedPaths.map((path) => baseUrl + path);

  // Create a new object with full URLs for profile_image
  return {
    ...userList.toJSON(),
    profile_image: fullUrls
  };

}

module.exports = { getFullImageUrlArray, getFullImageUrl }