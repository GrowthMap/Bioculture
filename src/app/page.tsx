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
				className="h-14 w-auto absolute top-8 left-1/2 transform -translate-x-1/2 z-50"
			/>
			<TypeformContainer />
		</div>
	);
}