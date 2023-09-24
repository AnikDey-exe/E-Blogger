export const BOTTOM_TAB_ROUTES = [
    {
        path: 'UserDetails',
        iconName: 'user',
        iconType: 'antdesign',
        selected: {
            iconName: 'user',
            iconType: 'font-awesome'
        },
        params: {
            email: ''
        }
    },
    {
        path: 'Home',
        iconName: 'home',
        iconType: 'antdesign',
        selected: {
            iconName: 'home',
            iconType: 'entypo'
        }
    },
    {
        path: 'BlogCreate',
        iconName: 'pluscircleo',
        iconType: 'antdesign',
        selected: {
            iconName: 'pluscircle',
            iconType: 'antdesign'
        }
    }, 
    {
        path: 'Messages',
        iconName: 'message1',
        iconType: 'antdesign',
        selected: {
            iconName: 'message',
            iconType: 'antdesign'
        }
    },
    {
        path: 'Notifications',
        iconName: 'bells',
        iconType: 'antdesign',
        selected: {
            iconName: 'bell',
            iconType: 'font-awesome'
        }
    }
]

export const SETTINGS_ROUTES = [
    {
        displayName: 'Edit Profile',
        displayNameMarginLeft: 0,
        path: 'ProfileEdit',
        iconName: 'user',
        iconType: 'font-awesome',
        iconSize: 25
    },
    {
        displayName: 'Privacy',
        displayNameMarginLeft: 1,
        path: 'Privacy',
        iconName: 'lock',
        iconType: 'font-awesome',
        iconSize: 25
    },
    {
        displayName: 'Format Date',
        displayNameMarginLeft: -2,
        path: 'DateFormatting',
        iconName: 'calendar',
        iconType: 'font-awesome',
        iconSize: 20
    },
    {
        displayName: 'Theme',
        displayNameMarginLeft: -2,
        path: 'ThemeMode',
        iconName: 'moon-o',
        iconType: 'font-awesome',
        iconSize: 20
    }
]