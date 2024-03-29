import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CloudDownloadIcon } from "@heroicons/react/outline";
import ImageViewer from "react-simple-image-viewer";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import ReactTimeAgo from "react-time-ago";

import JSZip from "jszip";
import { saveAs } from "file-saver";

import photosIcon from "../job/photosIcon.png";

const SharedJobPhotoListing = ({ photos, purchase_order }) => {
  const [currentImageInterior, setCurrentImageInterior] = useState(0);
  const [currentImageExterior, setCurrentImageExterior] = useState(0);
  const [currentImageCustomer, setCurrentImageCustomer] = useState(0);

  const [isViewerOpenInterior, setIsViewerOpenInterior] = useState(false);
  const [isViewerOpenExterior, setIsViewerOpenExterior] = useState(false);
  const [isViewerOpenCustomer, setIsViewerOpenCustomer] = useState(false);

  const [interiorPhotos, setInteriorPhotos] = useState([]);
  const [exteriorPhotos, setExteriorPhotos] = useState([]);
  const [customerPhotos, setCustomerPhotos] = useState([]);

  useEffect(() => {
    getPhotos();
  }, []);

  const openImageViewer = (index) => {
    setCurrentImageInterior(index);
    setIsViewerOpenInterior(true);
  };

  const openImageViewerExterior = (index) => {
    setCurrentImageExterior(index);
    setIsViewerOpenExterior(true);
  };

  const openImageViewerCustomer = (index) => {
    setCurrentImageCustomer(index);
    setIsViewerOpenCustomer(true);
  };

  const closeImageViewer = () => {
    setCurrentImageInterior(0);
    setIsViewerOpenInterior(false);
  };

  const closeImageViewerExterior = () => {
    setCurrentImageExterior(0);
    setIsViewerOpenExterior(false);
  };

  const closeImageViewerCustomer = () => {
    setCurrentImageCustomer(0);
    setIsViewerOpenCustomer(false);
  };

  const downloadPhoto = async (photo) => {
    const image = await fetch(photo.image);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    let label;
    if (photo.customer_uploaded) {
      label = "customer_provided_";
    } else {
      if (photo.interior) {
        label = "interior_";
      } else {
        label = "exterior_";
      }
    }

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = label + photo.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllPhotos = () => {
    const interiorImages = interiorPhotos.map((p) => {
      return { customer: false, interior: true, image: p.image, name: p.name };
    });
    const exteriorImages = exteriorPhotos.map((p) => {
      return { customer: false, interior: false, image: p.image, name: p.name };
    });
    const customerImages = customerPhotos.map((p) => {
      return { customer: true, image: p.image, name: p.name };
    });

    const allImages = [...customerImages, ...interiorImages, ...exteriorImages];

    var zip = new JSZip();
    let customerProvided = null;
    let interiorFolder = null;
    let exteriorFolder = null;

    if (customerImages.length > 0) {
      customerProvided = zip.folder("customer_provided");
    }

    if (interiorImages.length > 0) {
      interiorFolder = zip.folder("interior_photos");
    }

    if (exteriorImages.length > 0) {
      exteriorFolder = zip.folder("exterior_photos");
    }

    var count = 0;

    var zipFilename = purchase_order + "_all_photos.zip";
    allImages.forEach(async function (image, i) {
      const filename = image.name;

      const response = await fetch(image.image);

      response.blob().then((blob) => {
        if (image.customer) {
          customerProvided.file(filename, blob, { binary: true });
        } else {
          if (image.interior) {
            interiorFolder.file(filename, blob, { binary: true });
          } else {
            exteriorFolder.file(filename, blob, { binary: true });
          }
        }

        count++;
        if (count === allImages.length) {
          zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      });
    });
  };

  const getPhotos = () => {
    const interior_photos = [];
    const exterior_photos = [];
    const customer_photos = [];

    photos?.forEach((entry) => {
      if (entry.customer_uploaded) {
        customer_photos.push(entry);
      } else {
        if (entry.interior) {
          interior_photos.push(entry);
        } else {
          exterior_photos.push(entry);
        }
      }
    });

    setCustomerPhotos(customer_photos);
    setInteriorPhotos(interior_photos);
    setExteriorPhotos(exterior_photos);
  };

  return (
    <AnimatedPage>
      <h1 className="text-2xl font-semibold text-gray-600 relative top-1">
        Photos
      </h1>
      <div className="">
        {customerPhotos.length > 0 && (
          <>
            <div className="text-gray-500 text-xl mt-4 flex justify-between">
              <div className="relative top-1">
                <span className="font-semibold">Customer Provided</span>
                <span
                  className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                        rounded-full text-xs font-medium md:inline-block"
                >
                  {customerPhotos.length}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  className="rounded-lg p-2 cursor-pointer border hover:bg-gray-50 text-lg flex"
                  onClick={() => downloadAllPhotos()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-1"
                    style={{ top: "2px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-1 pl-9 xl:pl-1">
              {customerPhotos.map((photo, index) => (
                <div key={index} className="py-4">
                  <div
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => openImageViewerCustomer(index)}
                  >
                    <img
                      className="h-60 w-72 rounded-lg"
                      src={photo.image}
                      alt=""
                    />
                  </div>
                  <div className="flex text-gray-500 text-sm pt-2">
                    <CloudDownloadIcon
                      onClick={() => downloadPhoto(photo)}
                      className="flex-shrink-0 h-6 w-6 mr-2 cursor-pointer"
                    />
                    <span className="text-gray-500 text-md">
                      <ReactTimeAgo
                        date={new Date(photo.created_at)}
                        locale="en-US"
                        timeStyle="twitter"
                      />
                    </span>
                    <span className="text-md ml-3 truncate w-44 text-ellipsis overflow-hidden whitespace-nowrap">
                      {photo.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div>
          <div className="text-gray-500 text-xl mt-4 flex justify-between">
            <div className="relative top-1">
              <span className="font-semibold">Interior</span>
              {interiorPhotos.length > 0 && (
                <span
                  className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                        rounded-full text-xs font-medium md:inline-block"
                >
                  {interiorPhotos.length}
                </span>
              )}
            </div>
            {(interiorPhotos.length > 0 || exteriorPhotos.length > 0) &&
              customerPhotos.length === 0 && (
                <div className="flex justify-end">
                  <button
                    className="rounded-lg p-2 cursor-pointer border hover:bg-gray-50 text-lg flex "
                    onClick={() => downloadAllPhotos()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 mr-1 relative"
                      style={{ top: "2px" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download
                  </button>
                </div>
              )}
          </div>

          {interiorPhotos.length === 0 && (
            <div className="text-sm mt-10 flex flex-col items-center">
              <img
                className="block h-10 w-auto text-gray-200"
                src={photosIcon}
                alt="photos"
              />
              <div className=" text-gray-600 mt-4 text-xl">
                No photos uploaded
              </div>
            </div>
          )}

          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-1 pl-9 xl:pl-1">
            {interiorPhotos.map((photo, index) => (
              <div key={index} className="py-4">
                <div
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => openImageViewer(index)}
                >
                  <img
                    className="h-60 w-72 rounded-lg"
                    src={photo.image}
                    alt=""
                  />
                </div>
                <div className="flex text-gray-500 text-sm pt-2">
                  <CloudDownloadIcon
                    onClick={() => downloadPhoto(photo)}
                    className="flex-shrink-0 h-6 w-6 mr-2 cursor-pointer"
                  />
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    <ReactTimeAgo
                      date={new Date(photo.created_at)}
                      locale="en-US"
                      timeStyle="twitter"
                    />
                  </span>
                  <span className="text-sm pl-2 truncate w-44 text-ellipsis overflow-hidden whitespace-nowrap">
                    {photo.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pb-32">
          <div className="text-gray-500 text-xl mb-1 font-semibold mt-20">
            Exterior
            {exteriorPhotos.length > 0 && (
              <span
                className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                        rounded-full text-xs font-medium md:inline-block"
              >
                {exteriorPhotos.length}
              </span>
            )}
          </div>
          {exteriorPhotos.length === 0 && (
            <div className="text-sm mt-10 flex flex-col items-center">
              <img
                className="block h-10 w-auto text-gray-200"
                src={photosIcon}
                alt="photos"
              />
              <div className="text-gray-600 mt-4 text-xl">
                No photos uploaded
              </div>
            </div>
          )}
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-1 pl-9 xl:pl-1">
            {exteriorPhotos.map((photo, index) => (
              <div key={index} className="py-4">
                <div
                  className="flex-shrink-0 cursor-pointer"
                  onClick={() => openImageViewerExterior(index)}
                >
                  <img
                    className="h-60 w-72 rounded-lg"
                    src={photo.image}
                    alt=""
                  />
                </div>
                <div className="flex text-gray-500 text-sm pt-2">
                  <CloudDownloadIcon
                    onClick={() => downloadPhoto(photo)}
                    className="flex-shrink-0 h-6 w-6 mr-2 cursor-pointer"
                  />
                  <span className="text-gray-500 text-sm">
                    <ReactTimeAgo
                      date={new Date(photo.created_at)}
                      locale="en-US"
                      timeStyle="twitter"
                    />
                  </span>
                  <span className="text-sm ml-3 truncate w-44 text-ellipsis overflow-hidden whitespace-nowrap">
                    {photo.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isViewerOpenInterior && (
        <ImageViewer
          src={interiorPhotos.map((p) => p.image)}
          currentIndex={currentImageInterior}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}

      {isViewerOpenExterior && (
        <ImageViewer
          src={exteriorPhotos.map((p) => p.image)}
          currentIndex={currentImageExterior}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewerExterior}
        />
      )}

      {isViewerOpenCustomer && (
        <ImageViewer
          src={customerPhotos.map((p) => p.image)}
          currentIndex={currentImageCustomer}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewerCustomer}
        />
      )}
    </AnimatedPage>
  );
};

export default SharedJobPhotoListing;
