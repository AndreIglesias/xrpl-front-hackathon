import React from "react";
import Image from "next/image";

const NFTCard = ({ name, imageUrl }) => {
  return (
    <div className="rounded-lg shadow-lg p-4">
      <Image src={imageUrl} alt={name} width={200} height={200} className="rounded-lg" />
      <h3 className="text-xl font-bold">{name}</h3>
    </div>
  );
};

export default NFTCard;
