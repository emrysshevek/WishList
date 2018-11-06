# WishList
Make wishlists for holidays, birthdays, etc

# Database forms:
``` (json)
{Users: [
    {
        username: xxx,
        password: xxx,
        boards: [
            boardName, boardName, boardName
        ]
    }
    ]
},
{Boards: [
    {
        owner: username,
        boardName: xxx;
        password: xxx,
        settings: {
            hasPassword: t/f,
            hide: t/f,
            colors?: xxx
        },
        items: [
            Item, Item, Item
        ]
    }
    ]
},
{Items: 
    [
        {
            board: boardName,
            picture: xxx,
            title: xxx,
            description: xxx,
            enabled: t/f,
            link: xxx
        }
    ]
}
```

# Database operations:
-Users:
- find/check
- add
- delete
- update
- get all boards
- get account info

-Boards:
- find/check
- add
- delete
- update
- get all items
- get board settings

-Items:
- find/check
- add
- delete
- update
- get all items
- get info

-Routes:
- /login
- /register
- /find/user
- /find/board
- /find/item
- /get/user
- /get/board
- /get/item
