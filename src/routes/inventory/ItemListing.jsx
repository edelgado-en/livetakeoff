import { Link } from "react-router-dom";
import { PhotographIcon } from "@heroicons/react/outline";

const ItemListing = ({ isGridView, items, currentUser }) => {
  return (
    <div className="bg-white shadow sm:rounded-md mb-4">
      {!isGridView && (
        <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-6 xl:gap-x-8 mb-6 px-1">
          {items.map((item) => (
            <div key={item.id} className="group relative pr-2 pb-4">
              {!currentUser.isProjectManager && (
                <Link
                  to={`/inventory/${item.id}/details`}
                  className="flex-shrink-0 cursor-pointer"
                >
                  {item.photo && (
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="h-60 rounded-lg"
                    />
                  )}

                  {!item.photo && (
                    <PhotographIcon className="h-60 w-56 text-gray-200 items-center m-auto align-middle" />
                  )}
                </Link>
              )}

              {currentUser.isProjectManager && (
                <div className="flex-shrink-0 cursor-pointer">
                  {item.photo && (
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="h-60 rounded-lg"
                    />
                  )}

                  {!item.photo && (
                    <PhotographIcon className="h-60 w-56 text-gray-200 items-center m-auto align-middle" />
                  )}
                </div>
              )}

              <div className="mt-1 flex justify-between">
                <div className="flex gap-1">
                  <h3
                    className="text-sm text-gray-900 font-medium truncate"
                    style={{ maxWidth: "170px" }}
                  >
                    {item.name}
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {item.total_quantity}
                </p>
              </div>

              <div className="mt-2 text-sm text-gray-500 flex italic">
                Found in{" "}
                <span className="font-semibold mx-1">
                  {item.total_locations_found}
                </span>{" "}
                locations
              </div>

              <div className="mt-2 text-sm text-gray-500 flex justify-between gap-2 italic">
                <div>
                  <span>{item.area === "I" && "Interior"}</span>
                  <span>{item.area === "E" && "Exterior"}</span>
                  <span>{item.area === "B" && "Interior and Exterior"}</span>
                  <span>{item.area === "O" && "Office"}</span>
                </div>
                <div>
                  <span>{item.measure_by === "U" && "Unit"}</span>
                  <span>{item.measure_by === "G" && "Gallons"}</span>
                  <span>{item.measure_by === "B" && "Bottle"}</span>
                  <span>{item.measure_by === "O" && "Box"}</span>
                  <span>{item.measure_by === "L" && "Lb"}</span>
                  <span>{item.measure_by === "J" && "Jar"}</span>
                  <span>{item.measure_by === "T" && "Other"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isGridView && (
        <ul className="mt-1 divide-y divide-gray-200 border-t border-gray-200 sm:mt-0 sm:border-t-0">
          {items.map((item) => (
            <li key={item.id}>
              <div className="group block hover:bg-gray-50">
                <div className="flex items-center pr-4 pl-1 py-1">
                  <div className="flex min-w-0 flex-1 items-center">
                    {!currentUser.isProjectManager && (
                      <Link
                        to={`/inventory/${item.id}/details`}
                        className="flex-shrink-0 w-20"
                      >
                        <img
                          className="h-20 rounded-md group-hover:opacity-75"
                          src={item.photo}
                          alt=""
                        />
                      </Link>
                    )}
                    {currentUser.isProjectManager && (
                      <div className="flex-shrink-0 w-20">
                        <img
                          className="h-20 rounded-md group-hover:opacity-75"
                          src={item.photo}
                          alt=""
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div className="flex gap-4 justify-between">
                        <div className="text-sm font-medium">
                          <div className="flex gap-1">
                            <h3
                              className="text-sm text-gray-900 font-medium truncate"
                              style={{ maxWidth: "170px" }}
                            >
                              {item.name}
                            </h3>
                          </div>

                          <div className="mt-1 italic text-gray-500 text-sm font-normal">
                            <span>{item.area === "I" && "Interior"}</span>
                            <span>{item.area === "E" && "Exterior"}</span>
                            <span>
                              {item.area === "B" && "Interior and Exterior"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-4">
                      <div className="font-medium text-right">
                        {item.total_quantity}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemListing;
