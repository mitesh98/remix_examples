import { getJokesByUserId } from "~/utils/session.server";
import { json, LoaderFunction } from "@remix-run/node";
import { DEFAULT_JOKES_PAGE_SIZE, fieldsEnum } from "../types/const";
export let loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get(fieldsEnum.PAGE) ?? 0);
  const pageSize = Number(
    url.searchParams.get(fieldsEnum.PAGE_SIZE) ?? DEFAULT_JOKES_PAGE_SIZE
  );
  const userId = url.searchParams.get(fieldsEnum.USER_ID);

  try {
    //@ts-expect-error
    const jokes = await getJokesByUserId({
      page: page,
      pageSize: pageSize,
      userId: userId,
    });

    return json({ jokes });
  } catch (error) {
    console.error("Error fetching users:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
