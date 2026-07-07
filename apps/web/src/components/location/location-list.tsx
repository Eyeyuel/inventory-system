import { getLocations } from '@/services/client/location';

export default async function LocationList() {
  const locactions = await getLocations();

  if (locactions) {
    console.log('locations: ', locactions);
  } else {
    console.log('no locations');
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Locations fetched from location list.</h1>
    </div>
  );
}
