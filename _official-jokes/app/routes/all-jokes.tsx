import { ReactHTMLElement, useCallback, useEffect, useState } from "react";
import Search from "../components/search";
import Select from "../components/select";

import useDebounce from "../Hooks/useDebounce";
import ListUsers from "~/components/list-users";
import DisplayJokes from "../components/display-jokes";
import Pagination from "../components/pagination";
import {
  User,
  DEFAULT_PAGE_SIZE,
  DEFAULT_JOKES_PAGE_SIZE,
  fieldsEnum,
  APIEnum,
} from "../types/const";

export default function AllJokes() {
  const [searchText, setsearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [jokesPage, setJokesPage] = useState(0);
  const [jokes, setJokes] = useState([]);
  const [selectedUser, setSelectedUser] = useState<Array<User>>([]);
  // Custom hook for debounce
  useDebounce(
    useCallback(() => setDebouncedSearchText(searchText), [searchText]),
    400
  );

  //Fetching User List
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = new URL(APIEnum.LIST_USERS, window.location.origin);
        url.searchParams.append(fieldsEnum.PAGE, page.toString());
        url.searchParams.append(
          fieldsEnum.PAGE_SIZE,
          DEFAULT_PAGE_SIZE.toString()
        );
        url.searchParams.append(fieldsEnum.SEARCH_TEXT, debouncedSearchText);

        const response = await fetch(`${url.toString()}`);
        const data = await response.json();

        //@ts-expect-error
        setTotalUsers(data.users.total);
        setUsers(data.users.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [debouncedSearchText, page]);

  //Fetching Jokes
  useEffect(() => {
    const fetchJokes = async () => {
      if (selectedUser.length > 0) {
        try {
          let url = new URL(APIEnum.LIST_JOKES, window.location.origin);
          url.searchParams.append(fieldsEnum.PAGE, jokesPage.toString());
          url.searchParams.append(
            fieldsEnum.PAGE_SIZE,
            DEFAULT_JOKES_PAGE_SIZE.toString()
          );
          url.searchParams.append(fieldsEnum.USER_ID, selectedUser[0].id);

          const response = await fetch(url.toString());
          const data = await response.json();

          //@ts-expect-error
          setJokes(data.jokes.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        setJokes([]);
      }
    };

    fetchJokes();
  }, [selectedUser, jokesPage]);

  const mutateShowSearch = useCallback(function () {
    setShowSearch((s) => !s);
  }, []);

  // Callback for Search
  const callBack = useCallback((searchText: string) => {
    setsearchText(searchText);
  }, []);

  //Callback when selecting the user
  const selectCallback = useCallback((user: Array<User>) => {
    setSelectedUser(user);
    mutateShowSearch();
  }, []);
  const nextCallBack = useCallback(() => {
    setPage((p) => p + 1);
  }, []);
  const prevCallBack = useCallback(() => {
    setPage((p) => p - 1);
  }, []);
  return (
    <div className="bg-slate-200 h-screen text-black">
      <Select onClick={mutateShowSearch} user={selectedUser} />
      {showSearch && (
        <div className="  flex justify-start items-start relative flex-col">
          <Search
            callBackFunction={callBack}
            label="Search User"
            placeholder="Enter Username to Search "
          />
          <ListUsers users={users} selectCallback={selectCallback}>
            <Pagination
              showPrevious={page > 0}
              showNext={totalUsers - (page + 1) * DEFAULT_PAGE_SIZE > 0}
              nextCallBack={nextCallBack}
              prevCallBack={prevCallBack}
            />
          </ListUsers>
        </div>
      )}
      <DisplayJokes
        jokes={jokes}
        emptyMessage={
          selectedUser.length > 0
            ? "User have not added any jokes"
            : "Select an User to see his/her jokes"
        }
      />{" "}
    </div>
  );
}
