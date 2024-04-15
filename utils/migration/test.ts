import { PrismaClient } from "@prisma/client";
import { UserRoleType } from "../../graphql/operations";
import { data } from "./source";

const prisma = new PrismaClient();

async function main() {
  // phase 1
  await prisma.calendar.createMany({
    data: data.phase1.calendar.map((calendar) => {
      return {
        id: calendar.id,
        title: calendar.title,
        description: calendar.description,
        backgroundColor: calendar.backgroundColor,
        textColor: calendar.textColor,
        hasStatus: calendar.hasStatus,
      };
    }),
    skipDuplicates: true,
  });
  await prisma.calendarEventType.createMany({
    data: data.phase1.statusboard.map((calendarEventType) => {
      return {
        id: calendarEventType.id,
        title: calendarEventType.name,
        backgroundColor: calendarEventType.bgColor,
        textColor: calendarEventType.color,
      };
    }),
    skipDuplicates: true,
  });
  await prisma.calendarEventStatus.createMany({
    data: data.phase1.situationboard.map((calendarEventType) => {
      return {
        id: calendarEventType.id,
        title: calendarEventType.name,
        backgroundColor: calendarEventType.bgColor,
        textColor: calendarEventType.color,
      };
    }),
    skipDuplicates: true,
  });
  console.log("Phase 1 done");

  // phase 2
  await prisma.calendarEvent.createMany({
    data: data.phase2.events.map((event) => {
      return {
        id: event.id,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        calendarId: event.calendarId,
        title: event.title,
        description: event.description,
        typeId: event.statusBoardId,
        statusId: event.situtationBoardId,
        statusIndex: event.statusBoardIndex,
        importIdentifier:
          event.importIdentifier === null ? undefined : event.importIdentifier,
        importSource:
          event.importSource === null ? undefined : event.importSource,
      };
    }),
    skipDuplicates: true,
  });
  console.log("Phase 2 done");

  // phase 3
  await prisma.calendarEventReminder.createMany({
    data: data.phase3.eventsReminder.map((reminder) => {
      return {
        id: reminder.id,
        done: reminder.done,
        eventId: reminder.eventId,
        name: reminder.name === null ? undefined : reminder.name,
        remindAt: reminder.remindAt,
        remindDuration: reminder.remindDuration,
      };
    }),
    skipDuplicates: true,
  });
  console.log("Phase 3 done");

  // phase 4
  await prisma.department.createMany({
    data: data.phase4.department.map((department) => {
      return {
        id: department.id,
        name: department.name,
      };
    }),
    skipDuplicates: true,
  });
  await prisma.position.createMany({
    data: data.phase4.position.map((position) => {
      return {
        id: position.id,
        name: position.name,
      };
    }),
    skipDuplicates: true,
  });
  console.log("Phase 4 done");

  // phase 5
  await prisma.userLocalAuth.createMany({
    data: data.phase6.userLocalAuth.map((userLocalAuth) => {
      return {
        id: userLocalAuth.id,
        password: userLocalAuth.password,
        twoFaEmail: "",
        twoFaEmailSecret:
          userLocalAuth.twofaEmailSecret === null
            ? undefined
            : userLocalAuth.twofaEmailSecret,
        twoFaEmailLastSent:
          userLocalAuth.twofaEmailLastSent === null
            ? undefined
            : userLocalAuth.twofaEmailLastSent,
      };
    }),
    skipDuplicates: true,
  });
  await prisma.user.createMany({
    data: data.phase5.users.map((user) => {
      return {
        id: user.id,
        name: user.name ?? user.email,
        lastName: user.lastName,
        email: user.email,
        description: user.description,
        localAuthId: user.LocalAuth.id,
        password: "",
        departmentId: user.departmentId,
        positionId: user.positionId,
        role:
          user.Role.name === "ADMIN" ? UserRoleType.Admin : UserRoleType.User,
      };
    }),
    skipDuplicates: true,
  });
  await prisma.msAuthToken.createMany({
    data: data.phase6.msAuth.map((msAuthToken) => {
      return {
        id: msAuthToken.id,
        accessToken: msAuthToken.accessToken,
        expiresAt: msAuthToken.expiresAt,
        refreshToken: msAuthToken.refreshToken,
        scope: msAuthToken.scope,
        UserId: msAuthToken.userId,
      };
    }),
    skipDuplicates: true,
  }),
    console.log("Phase 5 done");

  // phase 6
  await prisma.calendarMember.createMany({
    data: data.phase7.calendarMembership.map((eventUser) => {
      return {
        id: eventUser.id,
        access:
          eventUser.type === "ADMIN" ? 3 : eventUser.type === "EDIT" ? 2 : 1,
        calendarId: eventUser.calendarId,
        userId: eventUser.userId,
        isPublic: eventUser.IsPublic,
        type: eventUser.IsPublic ? "Public" : "User",
      };
    }),
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
