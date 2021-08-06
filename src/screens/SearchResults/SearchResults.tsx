import React, { useState, useEffect } from 'react';
import Fuse from "fuse.js";
import { RouteComponentProps, useHistory, useLocation, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "hooks";
import { ISquidUser } from "utils/apiObjects";
/** interface for the items in the url */
interface ISearchResultsMatchProps {
  query: string,
}

interface IFuseSearchResults {
  item: ISquidUser
}
/** Props coming into the component */
interface ISearchResultsProps extends RouteComponentProps<ISearchResultsMatchProps> {
  data: any[]
  // theme: string
}

interface IProfileStateType {
  data: any[]
}


function SearchResults(props: ISearchResultsProps) {
  const history = useHistory();
  const query: string = props.match.params.query;
  const isLoggedIn: boolean = useAppSelector((state) => state.userState.isLoggedIn);
  const data: any[] = useLocation<IProfileStateType>().state.data;
  console.log(query);
  console.log(data);

  const [searchResults, setSearchResults] = useState<any[]>([]);

  const fuse = new Fuse(data, {
    keys: ["username", "real_name"],
  });

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/login');
    }
    var results: any[] = []
    var result: Fuse.FuseResult<ISquidUser>[] = fuse.search(query);
    console.log(result);
    if (!result.length) {
      setSearchResults([]);
    } 
    else {
      result.forEach((item: Fuse.FuseResult<ISquidUser>) => {
        results.push(item);
      });
      console.log(results);
      setSearchResults(results);
    }
  }, [])

  const selectUser = (user: ISquidUser) => {
    // navigate to profile page
    console.log(user);

  }

  return (
    <div className="inline-block lg:max-w-xl m-2 sm:mx-auto align-bottom bg-white dark:bg-primaryDark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      {searchResults.length > 0 && searchResults.map((result: Fuse.FuseResult<ISquidUser>) => (
        
        <Link key={result.refIndex} to={{pathname:`/profile/${result.item.username}`, state: {userId: result.item.ID}}} onClick={() => selectUser(result.item)} className="p-2 bg-green w-full text-left block hover:underline">
          {/* <button className="p-2 bg-green w-full text-left block hover:underline" onClick={() => selectUser(result.item)}> */}
          {result.item.username} other {result.item.email} AH {result.item.real_name}
        {/* </button> */}
        </Link>
        
      ))}
    </div>
  )
}

export default SearchResults;
