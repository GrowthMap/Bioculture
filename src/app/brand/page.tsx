import BrandForm from '@/components/typeform/BrandForm';
import Image from 'next/image';

export default function BrandPage() {
	return (
		<div className="">
			<Image
				src="/image.png"
				alt="BioСulture"
				width={150}
				height={40}
				className="h-18 w-auto z-50  flex items-center justify-center mx-auto "
			/>
			<BrandForm />
		</div>
	);
}