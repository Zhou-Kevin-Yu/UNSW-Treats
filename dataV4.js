const data = {
    users : [
        {
            uId: 0,
            nameFirst: "Gary",
            nameLast: "Sun",
            email: "gary.sun@student.unsw.edu.au",
            handleStr: "garysun",
            password: "bird27",
            permission: 1,   //owner user
        },
        {
            uId: 1,
            nameFirst: "Manav",
            nameLast: "Pawar",
            email: "manav.pawar@student.unsw.edu.au",
            handleStr: "manavpawar",
            password: "mjerry",
            permission: 2,      //just member user
        },
        {
            uId: 2,
            nameFirst: "Ben",
            nameLast: "Kernohan",
            email: "b.kerno@student.unsw.edu.au",
            handleStr: "bengy",
            password: "cosmo89",
            permission: 2,
        },
    ],
    channels : [
        {
            channelId: 0,
            name: "COMP1531",
            isPublic: false,
            ownerMembers: [{Manav}],
            allMembers : [{Gary}, {Manav}],     //the objects {Gary}, {Manav} contain uId, email, nameFirst, nameLast, handleStr 
            messages : [                        //but they were too much to put in :)
                {
                    messageId: 0,
                    uId: 2,                     //ben created the most recent message - "hey"
                    message: "hey",
                    timeSent: 1641241085833,    //Date.parse('2022-01-03T20:18:05.833Z') === 1641241085833
                },
                {
                    messageId: 1,
                    uId: 1,
                    message: "whats up",
                    timeSent: 1641241085803,    //"whats up" was sent by manav, 30 seconds before ben sent "hey"
                },
                        
            ],
        },
        {
            channelId: 1,
            name: "COMP2521",
            isPublic: false,
            ownerMembers: [{Gary}],
            allMembers : [{Gary}],
            messages : [],
        },
    ],
    dms: [
        {
            dmId: 0,
            creator: {Ben},
            members: [{Ben}, {Etkin}, {Manav}],
            name: "etkintetik, benkernohan, manavpawar",
            messages : [                        //but they were too much to put in :)
                {
                    messageId: 2,
                    uId: 2,                     //ben created the most recent message - "hey"
                    message: "hey",
                    timeSent: 1641241085833,    //Date.parse('2022-01-03T20:18:05.833Z') === 1641241085833
                },
                {
                    messageId: 3,
                    uId: 1,
                    message: "whats up",
                    timeSent: 1641241085803,    //"whats up" was sent by manav, 30 seconds before ben sent "hey"
                },
                        
            ]
        },
        {
            dmId: 0,
            name: "etkintetik, benkernohan, manavpawar "
        }
    ],
    systemInfo: {
        messageTotal: 4,
    }
};

//-------------- usage ---------------//
//accessing email of user index 1. === "manav.pawar@student.unsw.edu.au"
console.log(data.users[1].email);

//accessing second most recent message of channelId 0. === "whats up"
console.log(data.channels[0].messages[1].message);

//checking the userId of member index = 1 in the channel with channelId = 0
data.channels[0].allMembers[1].uId 

