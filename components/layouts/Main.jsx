const Main = ({ children, class_name, leave, deleteClass, isAdmin }) => {
  return (
    <div className="bg-gray-100 min-h-screen py-5">
      <div className="max-w-screen-sm mx-auto bg-white min-h-[calc(100vh-2.5rem)] p-10 rounded-xl overflow-clip">
        <nav className="flex justify-center items-center border-b-2 py-4 -mx-10 -mt-10">
          <a href="#">Logo</a>
          <span className="mx-2">/</span>
          <a href="#">{class_name ?? "[CLASS NAME]"}</a>
          <span className="mx-2">-</span>
          <button
            onClick={leave}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded-md text-sm"
          >
            Leave
          </button>
          {isAdmin ? (
            <button
              onCanPlay={deleteClass}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded-md text-sm ml-2"
            >
              Delete Class
            </button>
          ) : (
            ""
          )}
        </nav>
        <div className="py-5">{children}</div>
      </div>
    </div>
  );
};

export default Main;
