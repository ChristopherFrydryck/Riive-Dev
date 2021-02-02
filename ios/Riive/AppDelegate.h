// Copyright 2015-present 650 Industries. All rights reserved.

#import <UIKit/UIKit.h>
#import <ExpoKit/EXStandaloneAppDelegate.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate : EXStandaloneAppDelegate <UIApplicationDelegate, UNUserNotificationCenterDelegate>

    @property (nonatomic, strong) UIWindow *window;

@end
