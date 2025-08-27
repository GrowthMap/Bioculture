import TypeformContainer from '@/components/typeform/TypeformContainer';
import Image from 'next/image';

export default function Home() {
	return (
		<div className="">
			<Image
				src="/image.png"
				alt="BioСulture"
				width={150}
				height={40}
				className="h-18 w-auto z-50  flex items-center justify-center mx-auto "
			/>
			<TypeformContainer />
		</div>
	);
}