import React from 'react';

//component that takes an nft object and maps it to corresponding elements
const NFTCard = ({nft}: {nft: any}) => {
    return (
        <div className='max-w-lg rounded overflow-hidden shadow-lg'>
            <img src={nft.imageUrl} alt="" className='w-full' />
            <div className='px-4 py-4'>
                <div className='font-bold text-teal-600 text-xl mb-2'>{nft.name}</div>
                <ul>
                    <li>Collection Name: <strong>{nft.collectionName}</strong></li>
                </ul>
            </div>
            <div className='px-6 py-4'>
                {nft.traits?.map((trait: { trait_type: string, value: string }, index: number) => (
                <span key={index} className="inline-block bg-gray-200
                 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 mr-2">{trait.trait_type}:{trait.value}
                </span>))}
                <div>
                </div>
            </div>
        </div>
    )
}

export default NFTCard;