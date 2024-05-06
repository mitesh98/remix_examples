import { getUsers } from "~/utils/session.server";
import { json, LoaderFunction } from "@remix-run/node";
import { DEFAULT_PAGE_SIZE, fieldsEnum } from "../types/const";
// API for List Users support pagination , search
export let loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get(fieldsEnum.PAGE) ?? 0);
  const pageSize = Number(
    url.searchParams.get(fieldsEnum.PAGE_SIZE) ?? DEFAULT_PAGE_SIZE
  );
  const searchText = url.searchParams.get(fieldsEnum.SEARCH_TEXT);

  try {
    //@ts-expect-error
    const users = await getUsers({
      page: page,
      pageSize: pageSize,
      searchText: searchText,
    });
    return json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
