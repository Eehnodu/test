import { useState } from "react";
import SearchFilter from "@/component/admin/common/searchFitler";
import { useGet } from "@/hooks/common/useAPI";
import SortSelector, {
  SortOption,
} from "@/component/admin/common/sortSelector";
import Pagination from "@/component/common/pagination";
import { makeQuery } from "@/utils/format/query";

const AdminMain = () => {
  const [page, setPage] = useState(1);
  const [searchType, setSearchType] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState<SortOption>("created_at");

  // const apiUrl = `api/admin/users?${makeQuery({
  //   page,
  //   row_count: 12,
  //   search_type: searchType !== "all" ? searchType : undefined,
  //   search_value: searchValue.trim(),
  //   sort,
  // })}`;

  const rows = [];
  const total = 0;

  return (
    <>
      <div className="flex flex-col w-full h-full relative px-20 py-10">
        <div className="flex items-end justify-between gap-4 px-8">
          <SortSelector
            value={sort}
            options={["created_at", "user_nickname"]}
            onChange={setSort}
          />
          <SearchFilter
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            searchValue={searchValue}
            onSearchValueChange={setSearchValue}
            onSubmit={() => setPage(1)}
            searchTypeOptions={[
              { value: "all", label: "카테고리 선택" },
              { value: "user_email", label: "이메일" },
              { value: "user_nickname", label: "유저명" },
            ]}
          />
        </div>
        {/* content */}
        <div className="flex flex-col w-full p-5 gap-24"></div>
        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <Pagination
            page={page}
            total={total}
            onPageChange={setPage}
            groupSize={5}
          />
        </div>
      </div>
    </>
  );
};

export default AdminMain;
