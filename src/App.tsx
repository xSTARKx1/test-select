import { Select } from './components/Select/Select.tsx'

function App() {
	const options = Array.from({ length: 10000 }, (_, index) => ({
		text: `Option ${index + 1}`,
	}))

	return <Select options={options} />
}

export default App
