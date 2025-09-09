import GuestForm from '@/components/typeform/GuestForm';
import Image from 'next/image';

export default function GuestPage() {
	return (
		<div className="">
			<Image
				src="/image.png"
				alt="BioСulture"
				width={150}
				height={40}
				className="h-18 w-auto z-50  flex items-center justify-center mx-auto "
			/>
			<GuestForm />
		</div>
	);
}