const data = {
    users : [
        {
            uId: 0,
            nameFirst: "Gary",
            nameLast: "Sun",
            email: "gary.sun@student.unsw.edu.au",
            handleStr: "Gazza",
            password: "bird27",
        },
        {
            uId: 1,
            nameFirst: "Manav",
            nameLast: "Pawar",
            email: "manav.pawar@student.unsw.edu.au",
            handleStr: "manny",
            password: "mjerry",
        },
        {
            uId: 2,
            nameFirst: "Ben",
            nameLast: "Kernohan",
            email: "b.kerno@student.unsw.edu.au",
            handleStr: "bengy",
            password: "cosmo89",
        },
    ],
    channels : [
        {
            channelId: 0,
            name: "COMP1531",
            isPublic: false,
            ownerMembers: [],
            allMembers : [],
            messages : [
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
            ownerMembers: [],
            allMembers : [],
            messages : [],
        },
    ]
};

//-------------- usage ---------------//
//accessing email of user index 1. === "manav.pawar@student.unsw.edu.au"
console.log(data.users[1].email);

//accessing second most recent message of channelId 0. === "whats up"
console.log(data.channels[0].messages[1].message);

