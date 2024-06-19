const MY_USER_ID = 771417;          // TODO: replace with your user id
const X_CSRF_TOKEN = '############' // TODO: replace with your sessions x-csrf-token

async function getMyFriends() {
  const response = await fetch(`https://friends.roblox.com/v1/users/${ MY_USER_ID }/friends`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const json = await response.json()
  return json
}

async function unfollowNext(friends, cursor = '') {
  const response = await fetch(`https://friends.roblox.com/v1/users/${ MY_USER_ID }/followings?limit=100&cursor=${ cursor }`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const json = await response.json()
  json.data.forEach(({ id }) => {
    if (!friends.includes(id))
      fetch(`https://friends.roblox.com/v1/users/${ id }/unfollow`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': document.cookie,
          'x-csrf-token': X_CSRF_TOKEN,
        }
      })
  })
  if (json.nextPageCursor !== null)
    setTimeout(() => unfollowNext(friends, json.nextPageCursor), 5000)
}

getMyFriends().then(({ data }) => unfollowNext(data.map(({ id }) => id)))
