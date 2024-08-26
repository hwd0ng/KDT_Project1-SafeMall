import { useLocation } from "react-router-dom";

import Searchshop from "./searchshop";
import Searchcomshop from "./searchcomshop";

export default function SearchDetail() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const state = type === '1' ? true : false; //1:피해다발, 0:일반

  console.log(location);
  console.log(searchParams);
  console.log(state);

  return (
    <>
      {state ? <Searchcomshop /> : <Searchshop />}
    </>
  );
}