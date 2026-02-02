
import React, { useState } from 'react';
import { Product, Review, Vendor, Profile } from './types';

interface ProductDetailProps {
  product: Product;
  vendor?: Vendor;
  reviews: Review[];
  currentUser: Profile | null;
  onAddToCart: (p: Product) => void;
  onAddReview: (review: Partial<Review>) => void;
  onBack: () => void;
}

export const ProductDetailView: React.FC<ProductDetailProps> = ({ 
  product, vendor, reviews, currentUser, onAddToCart, onAddReview, onBack 
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    onAddReview({
      productId: product.id,
      userId: currentUser.id,
      userName: currentUser.fullName,
      rating,
      comment
    });
    setComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={onBack}
        className="mb-12 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-950 flex items-center transition-colors"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to Market
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-24">
        <div className="relative aspect-square overflow-hidden rounded-[48px] bg-zinc-50 shadow-2xl">
          <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
          <div className="absolute top-8 left-8">
            <span className="px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-100 shadow-sm">
              {product.condition}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-10">
            <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">{product.category}</p>
            <h1 className="text-4xl md:text-6xl font-black text-zinc-950 tracking-tighter mb-6 leading-none">{product.name}</h1>
            <p className="text-2xl font-black text-zinc-950 mb-8">${product.price}</p>
            <p className="text-zinc-500 text-lg leading-relaxed font-medium mb-10">{product.description}</p>
            
            <div className="flex items-center gap-6 p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 mb-10">
               <img src={vendor?.logoUrl} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
               <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Sold By</p>
                  <p className="font-black text-zinc-950">{vendor?.storeName || 'Campus Vendor'}</p>
               </div>
               {vendor?.isVerified && <i className="fas fa-check-circle text-indigo-500 ml-auto mr-4"></i>}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-zinc-950 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
              >
                Add to Bag
              </button>
              <button className="w-20 bg-white border border-zinc-100 rounded-3xl flex items-center justify-center text-zinc-400 hover:text-zinc-950 transition-all shadow-sm">
                <i className="far fa-heart text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl">
        <h2 className="text-3xl font-black text-zinc-950 tracking-tighter mb-12">Reviews & Ratings</h2>
        
        {currentUser && (
          <div className="bg-white p-10 rounded-[48px] border border-zinc-100 shadow-sm mb-16">
            <h3 className="text-lg font-black text-zinc-950 mb-8 tracking-tight">Leave a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-8">
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${rating >= star ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-50 text-zinc-300'}`}
                    >
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">Your Thoughts</label>
                <textarea 
                  required
                  rows={4}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="How was the product? Fast handover? Fair price?"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-[28px] px-8 py-6 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                ></textarea>
              </div>
              <button className="bg-zinc-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px]">Submit Review</button>
            </form>
          </div>
        )}

        <div className="space-y-10">
          {reviews.length > 0 ? reviews.map(review => (
            <div key={review.id} className="flex gap-8 group">
              <img src={`https://ui-avatars.com/api/?name=${review.userName}&background=f4f4f5&color=09090b`} className="w-12 h-12 rounded-2xl flex-shrink-0" alt="" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-black text-zinc-950 mb-1">{review.userName}</p>
                    <div className="flex gap-1 text-[10px] text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`${i < review.rating ? 'fas' : 'far'} fa-star`}></i>
                      ))}
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-zinc-500 font-medium leading-relaxed">{review.comment}</p>
              </div>
            </div>
          )) : (
            <p className="text-zinc-300 italic font-medium py-10">No reviews yet for this node asset.</p>
          )}
        </div>
      </div>
    </div>
  );
};
