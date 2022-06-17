const user = {
    uId: 1,
    nameFirst: "Gary",
    nameLast: "Sun",
    email: "gary.sun@student.unsw.edu.au",
    handleStr: "Gazza",
    password: "bird27",
};

const channel = {
    channelId: 111,
    name: "COMP1531",
    isPublic: false,
    ownerMembers: [],
    allMembers : [],
    //this could change in the future
    messages : 
        [
            {
                messageId : 1,
                uId : 3,
                message : "hey sexy",
                timeSent : 2355,
            },
        ],
};

const data = {
  users : {
      0 :
        {
            uId: 1,
            nameFirst: "Gary",
            nameLast: "Sun",
            email: "gary.sun@student.unsw.edu.au",
            handleStr: "Gazza",
            password: "bird27",
        },
      2 :
        {
            uId: 2,
            nameFirst: "Manav",
            nameLast: "Pawar",
            email: "manav.pawar@student.unsw.edu.au",
            handleStr: "manny",
            password: "mjerry",
        }
      3 :
        {
            uId: 3,
            nameFirst: "Kevin",
            nameLast: "Yu",
            email: "Kevin.Yu@student.unsw.edu.au",
            handleStr: "Kdog",
            password: "monster68",
        }
  },
  channels : {
      0 :
        {
            channelId: 0,
            name: "COMP1531",
            isPublic: false,
            ownerMembers: [],
            allMembers : [],
            messages : [],
        },
      1 :
        {
            channelId: 1,
            name: "COMP2521",
            isPublic: false,
            ownerMembers: [],
            allMembers : [],
            messages : [],
        },
      2 :
        {
            channelId: 2,
            name: "COMP6080",
            isPublic: true,
            ownerMembers: [],
            allMembers : [],
            messages : [],
        },
  }
};

//usage


