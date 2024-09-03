# deno_googleapis_cli

A Google API CLIs (generator) for Deno.

Forked from [deno_googleapis](https://github.com/lucacasonato/deno_googleapis).
This fork adds a cli (generator) to generated the client library.

generated codes are deployed on https://deno-googleapis-cli.deno.dev/

## Usage

You can run the generated cli with `deno run` command. For each api, there is a
`.ts` file which contains the generated cli.

You can check the available apis at https://deno-googleapis-cli.deno.dev/

For example, you can show the help message for the YouTube Data API v3:
https://deno-googleapis-cli.deno.dev/v1/youtube:v3.ts

```sh
$ deno run --allow-net https://deno-googleapis-cli.deno.dev/v1/youtube:v3.ts -h
```

```
Usage: YouTube

Description:

  The YouTube Data API v3 is an API that provides access to YouTube data, such as videos, playlists, and channels.

Options:

  -h, --help  - Show this help.  

Commands:

  abuseReportsInsert             - Inserts a new resource into this collection.                                  
  activitiesList                 - Retrieves a list of resources, possibly filtered.                             
  captionsDelete                 - Deletes a resource.                                                           
  captionsDownload               - Downloads a caption track.                                                    
  captionsInsert                 - Inserts a new resource into this collection.                                  
  captionsList                   - Retrieves a list of resources, possibly filtered.                             
  captionsUpdate                 - Updates an existing resource.                                                 
  channelBannersInsert           - Inserts a new resource into this collection.                                  
  channelSectionsDelete          - Deletes a resource.                                                           
  channelSectionsInsert          - Inserts a new resource into this collection.                                  
  channelSectionsList            - Retrieves a list of resources, possibly filtered.                             
  channelSectionsUpdate          - Updates an existing resource.                                                 
 ...
```

These are subcommands of the cli, which corresponds to the methods of the API.

You can show the help message for the `playlistItemsList` subcommand (method) of
the YouTube Data API v3:

```sh
$ deno run --allow-net https://deno-googleapis-cli.deno.dev/v1/youtube:v3.ts playlistItemsList -h
```

```
Usage: YouTube playlistItemsList

Description:

  Retrieves a list of resources, possibly filtered.

Options:

  -h, --help                                          - Show this help.                                                                   
  --apiKey                  <apiKey>                  - API Key                                                                           
  --id                      [id]                      -                                                                                   
  --maxResults              [maxResults]              - The *maxResults* parameter specifies the maximum number of items that should be   
                                                        returned in the result set.                                                       
  --onBehalfOfContentOwner  [onBehalfOfContentOwner]  - *Note:* This parameter is intended exclusively for YouTube content partners. The  
                                                        *onBehalfOfContentOwner* parameter indicates that the request's authorization     
                                                        credentials identify a YouTube CMS user who is acting on behalf of the content    
                                                        owner specified in the parameter value. This parameter is intended for YouTube    
                                                        content partners that own and manage many different YouTube channels. It allows   
                                                        content owners to authenticate once and get access to all their video and         
                                                        channel data, without having to provide authentication credentials for each       
                                                        individual channel. The CMS account that the user authenticates with must be      
                                                        linked to the specified YouTube content owner.                                    
  --pageToken               [pageToken]               - The *pageToken* parameter identifies a specific page in the result set that       
                                                        should be returned. In an API response, the nextPageToken and prevPageToken       
                                                        properties identify other pages that could be retrieved.                          
  --part                    <part>                    - The *part* parameter specifies a comma-separated list of one or more              
                                                        playlistItem resource properties that the API response will include. If the       
                                                        parameter identifies a property that contains child properties, the child         
                                                        properties will be included in the response. For example, in a playlistItem       
                                                        resource, the snippet property contains numerous fields, including the title,     
                                                        description, position, and resourceId properties. As such, if you set             
                                                        *part=snippet*, the API response will contain all of those properties.            
  --playlistId              [playlistId]              - Return the playlist items within the given playlist.                              
  --videoId                 [videoId]                 - Return the playlist items associated with the given video ID.
```

You can run the `playlistItemsList` subcommand with the `--apiKey` option to get
the playlist items of a playlist:

```sh
deno run --allow-net https://deno-googleapis-cli.deno.dev/v1/youtube:v3.ts \
  playlistItemsList \
  --apiKey XXXXX \
  --playlistId XXXX \
  --part 'contentDetails,id,snippet' \
  --maxResults 50
```

## Install

You can install the generated cli with `deno install` command.

For example, you can install the YouTube Data API v3 cli:

```sh
$ deno install -g -n youtube --allow-net https://deno-googleapis-cli.deno.dev/v1/youtube:v3.ts
```

Then you can run the cli with the command name:

```sh
$ youtube -h
```
