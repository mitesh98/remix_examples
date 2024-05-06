import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { db } from "./db.server";

type LoginForm = {
  password: string;
  username: string;
};

export async function register({ password, username }: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { passwordHash, username },
  });
  return { id: user.id, username };
}

export async function login({ password, username }: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return null;
  }

  return { id: user.id, username };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  const user = await db.user.findUnique({
    select: { id: true, username: true },
    where: { id: userId },
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}
export async function getUsers(request:any) {
  const page=request?.page
  const pageSize=request?.pageSize
  const searchText=request?.searchText
  const skip = page * pageSize||0;
  // Fetch Users List
  const queryOptions: any = {
    skip,
    take: pageSize,
  };
  if (searchText) {  
    queryOptions.where = {
      username: {
        contains: searchText,
      },
    };
  }
  const users = await db.user.findMany(queryOptions);

  // Count of users 
  const countQueryOptions: any = {};
  if (searchText) {  
    countQueryOptions.where = {
      username: {
        contains: searchText,
      },
    };
  }

  const countUsers=await db.user.count(countQueryOptions)
  return {data:users,total:countUsers};
}
export async function getJokesByUserId(request:any){
  const page=request?.page||0
  const pageSize=request?.pageSize||10
  const skip = page * pageSize||0;
  const userId=request?.userId
  //Count Jokes by User
  const jokeListCount = await db.joke.count({
    where: { jokesterId: userId }
  });
  //Fetch Jokes
  const jokeListItems = await db.joke.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true,content:true },
      take: pageSize,
      skip,
      where: { jokesterId: userId },
    });
   
  return {data:jokeListItems,total:jokeListCount};
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
