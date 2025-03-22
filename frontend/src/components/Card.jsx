// import Image from "next/image";
import { Star } from "lucide-react";

export function ItemCard({ item }) {
  console.log(item)
  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      {/* Image Section */}
      <div className="relative w-full h-48 bg-gray-200">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.itemName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          {item.itemName}
        </h3>

        <div className="flex justify-between text-sm text-gray-600 mb-2">
         {/* {item.itemType=="Non-Perishable" && <span> expires on: {item.expiryDate.toLocaleDateString("en-US", {day: "2-digit",month: "long",year: "numeric",});}</span>} */}
         {/* {item.itemType=="Perishable" && <span> expires in: {current time - item.expiryDate time}</span>} */}
         {item.itemType === "Non-Perishable" && (
            <span>Expires on: {new Date(item.expiryDate).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}</span>)}

          {item.itemType === "Perishable" && (() => {
            const expiryDate = new Date(item.expiryDate);
            const now = new Date();
            const timeDiff = expiryDate - now;

            if (timeDiff <= 0) return <span>Expired</span>;

            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            
            return <span>Expires in: {daysLeft} {daysLeft === 1 ? "day" : "days"}</span>;
          })()}
          <span>{item.distance} away</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          {/* Served By Section */}
          <div>
            <div className="text-gray-500">Served By</div>
            <div className="font-medium">{item.name}</div>
          </div>

          {/* Ratings Section */}
          <div className="flex items-center">
            {item.listedByType=="Resturant"&&<span className="mr-1 text-gray-500">{item.ratings}</span>}
            <div className="flex">
              
              {[...Array(1)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < item.ratings
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cost Section (Visible Only for Non-Donations) */}
        {item.type !== "Donation" && (
          <div className="mt-2 text-right text-sm font-semibold text-gray-800">
            Cost: ${item.cost?.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
