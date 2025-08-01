//
//  NotificationService.m
//  CleverPushNotificationServiceExtension
//
//  Created by CleverPush SDK on {{CREATION_DATE}}.
//  Copyright © {{CURRENT_YEAR}} CleverPush. All rights reserved.
//

#import "CleverPush/CleverPush.h"
#import "NotificationService.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNNotificationRequest *receivedRequest;
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    NSLog(@"[CleverPush] NSE: didReceiveNotificationRequest called");
    NSLog(@"[CleverPush] NSE: Notification payload: %@", request.content.userInfo);
    
    self.receivedRequest = request;
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];

    // Use CleverPush's official NSE handling
    NSLog(@"[CleverPush] NSE: Calling CleverPush didReceiveNotificationExtensionRequest");
    [CleverPush didReceiveNotificationExtensionRequest:self.receivedRequest withMutableNotificationContent:self.bestAttemptContent];

    NSLog(@"[CleverPush] NSE: Delivering notification content");
    self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
    NSLog(@"[CleverPush] NSE: serviceExtensionTimeWillExpire called");
    
    // Use CleverPush's official NSE time expire handling
    [CleverPush serviceExtensionTimeWillExpireRequest:self.receivedRequest withMutableNotificationContent:self.bestAttemptContent];

    NSLog(@"[CleverPush] NSE: Delivering final notification content");
    self.contentHandler(self.bestAttemptContent);
}

@end