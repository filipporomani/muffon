export function artist (
  artistData
) {
  const {
    name
  } = artistData

  return {
    model: 'artist',
    name
  }
}

export function album (
  albumData
) {
  const {
    source,
    title,
    artist,
    artists,
    image
  } = albumData

  return {
    model: 'album',
    source,
    title,
    artist,
    artists,
    image
  }
}

export function track (
  trackData
) {
  const {
    source,
    title,
    artist,
    artists,
    album,
    image,
    audio
  } = trackData

  const artistData = {
    ...artist
  }

  delete artistData.image

  const audioData = audio && {
    present: audio.present
  }

  return {
    model: 'track',
    source,
    player_id:
      trackData.player_id,
    title,
    artist: artistData,
    artists,
    album,
    image,
    audio: audioData
  }
}

export function video (
  videoData
) {
  return {
    model: 'video',
    youtube_id:
      videoData.source.id
  }
}

export function videoChannel (
  channelData
) {
  return {
    model: 'video_channel',
    youtube_id:
      channelData.source.id
  }
}

export function videoPlaylist (
  playlistData
) {
  return {
    model: 'video_playlist',
    youtube_id:
      playlistData.source.id
  }
}

export function playlist (
  playlistData
) {
  return {
    model: 'playlist',
    id: playlistData.id
  }
}

export function community (
  communityData
) {
  return {
    model: 'community',
    id: communityData.id
  }
}
