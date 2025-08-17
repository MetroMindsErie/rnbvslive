export default function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="absolute bottom-0 left-0 right-0 p-8 bg-transparent z-10">
			<div className="container mx-auto text-center">
				<p className="text-white/80 text-sm">
					&copy; 2023-{currentYear} R&B Versus LIVE. All rights reserved.
				</p>
			</div>
		</footer>
	)
}
