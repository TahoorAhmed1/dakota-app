import Image from "next/image";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import flukton1 from "@/assets/flukton/image1.jpeg";
import flukton2 from "@/assets/flukton/image2.jpg";
import flukton3 from "@/assets/flukton/image3.jpg";
import flukton4 from "@/assets/flukton/image4.jpg";
import flukton5 from "@/assets/flukton/image5.jpg";
import flukton6 from "@/assets/flukton/image6.jpg";

type InformativeLink = { label: string; href: string };

type CampDetail = {
  name: string;
  location: string;
  county: string;
  description: string;
  capacity?: string;
  amenities: string[];
  images: (string | StaticImageData)[];
  informativeLinks?: InformativeLink[];
  packages?: string[];
  acres?: string;
  highlights?: string[];
  videos?: string[];
  reviews?: string[];
  reviewTitle?: string;
};

const campDetails: Record<string, CampDetail> = {
  
  "gunners-haven": {
    name: "Gunner's Haven Pheasant Camp",
    location: "Selby, South Dakota",
    county: "Walworth County",
    description:
      "The Gunner's Haven Pheasant Camp is located near Selby South Dakota, in Walworth County. Walworth county has long been known for it's abundant pheasant populations. South Dakota Game Fish and Parks tracks pheasant numbers annually and Walworth county is always on the high side for bird number (rank at over 200+ pheasants per square mile) compared to other parts of the state. From your hunting base camp you'll enjoy watching wildlife and enjoy the pace of a South Dakota pheasant hunting schedule. Your lodging is located right in the middle of a shelterbelt and section of farmland.",
    capacity: "6-10 hunters",
    amenities: [
      "(2) Bathrooms/showers/Toilets in the lodge",
      "Satellite TV and WIFI Internet access",
      "Indoor heated bird cleaning facility",
      "Freezer for birds",
      "Sink, Stove and Fridge",
      "Dining table and chairs",
      "BBQ Grill",
    ],
    images: [flukton1, flukton2, flukton3, flukton4, flukton5, flukton6],
    informativeLinks: [
      { label: "Lodging", href: "#" },
      { label: "Hunting Land", href: "#" },
      { label: "Location Map", href: "#" },
      { label: "Local Weather", href: "#" },
      { label: "Availability", href: "#" },
      { label: "Tourism Activities", href: "#" },
    ],
    packages: [
      "3-Day Hunt - Minimum 6 Hunters and up for 4-Nights Lodging (Capacity 10)",
    ],
    acres: "3000 acres of total land access for hunting. 850 acres of leased land with 800 of it in CRP. 50 acres of corn and milo food plots in 15 individual plots variety of cover on 700 acres of waterbank, along tree plots and food plots. 20 acres of tree plots, various shelterbelts. 50 acres of creekbeds, sloughs and grass waterways.",
    highlights: [
      "Abundant acres of private access, high pheasant populations, no charge waterfowl options",
      "Pheasant Camp lodging for groups of 6 to 10 located on-site and not far from town",
      "Hunt right from your lodging as you are in the middle of section of pheasant land",
      "Wake up to roosters crowing outside your door",
      "Abundant Walk-in and other public ground to extend your hunting trip extra days",
      "Excellent waterfowl hunting in area. No additional charge. Many sloughs to hunt",
      "75 miles west of Aberdeen SD - Walworth County",
    ],
    videos: [
      "https://www.youtube.com/embed/HuAeIAM9OK8?si=aTPR7uOLi_qlyMT5",
    ],
    reviewTitle: "Gunner's Haven Pheasant Camp Reviews",
    reviews: [
      `"Chris, we had a good time at Gunners Haven. Saw a lot of birds. Ended up with 31-32 between the 5 of us for 3 days hunting. The owners were great hosts and the weather worked out perfect for the dogs. We appreciated the fact that they let us bring the dogs inside at night and park the dog trailer in their heated shop to help them stay warm after hunting as hard as they did during the trip. Overall it was a great trip." - Wes, OK`,
      `"Had a great hunt. Weather was awesome. Little warm on Saturday but great on Sun and Monday. Saw good amount of birds. The good plot was well managed with food plots/shelter/crp. I think they are planning on planting some food plots on the other areas next year. The hosts are VERY nice. Lodgings are adequate. Great to allow the dog in the house and they also have a nice little mud room with washer/dryer (we didn't need but many will enjoy that during wet/snowy hunts later in the year). Other nice amenities included satellite TV (with the Big Ten Network so I didn't even miss my Penn State Nittany lions thrashing Iowa!) and WIFI so I could keep up with things back home. I would definitely include those in the brochure! My dad and I sat on the back porch on Saturday after both shooting our limits early that day and had a beer and a cigar. Great times!" - Jeff, PA`,
    ],
  },
  "meadow-creek": {
    name: "Meadow Creek Pheasant Camp",
    location: "Meadow, South Dakota",
    county: "Perkins County",
    description:
      "If you are looking to hunt in a remote area of South Dakota that boasts abundant populations of Ringneck Pheasants, Sharptail Grouse and Hungarian Partridge then look no further. Meadow Creek Pheasant Camp is located near Lemmon in northwest South Dakota, just south of the 155,000 acre Grand River National Grassland. This camp offers private secluded lodging in an area that has recently installed 100's of acres of CP-38 SAFE CRP. If you are looking for sun up to sun down hunting opportunities then this is your place. Daily limits of Ringneck Pheasant, Sharptail Grouse and Hungarian Partridge are 3, 3 and 5 respectively. Possession limits are all 15 for each species.",
    capacity: "Up to 12 hunters",
    amenities: [
      "Sleeping 12 hunters",
      "2 Bathrooms/Showers/Toilets, all linens/towels/washclothes provided",
      "Sink, Stove and Fridge and compliment of cooking amenities",
      "Dining table, chairs, couches",
      "HDTV Satellite TV",
      "WIFI",
      "Heated sheltered bird cleaning and dog kenneling building",
      "Gas BBQ Grill",
      "Vehicle available for your use - 1997 Chevy Tahoe - Replace fuel you use",
    ],
    images: [flukton1, flukton2, flukton3, flukton4, flukton5, flukton6],
    informativeLinks: [
      { label: "Lodging", href: "#" },
      { label: "Hunting Land", href: "#" },
      { label: "Location Map", href: "#" },
      { label: "Local Weather", href: "#" },
      { label: "Availability", href: "#" },
      { label: "Tourism Activities", href: "#" },
    ],
    packages: [
      "4-Day Hunt - See Package Options for Minimums",
      "3-Day Hunt - See Package Options for Minimums",
    ],
    acres: "3700 +/- Acres total. Abundance of all different types of CRP, crops and food plots for prime pheasant hunts. 1230 acres of CRP, 130 acres of food plots (29 total plots), 315 Cropland acres of milo/millet, 50 acres of dam/slough/creekbed, 60 Creekbed acres, 1000 acres of hayed/grazed pasture (can find grouse or huns here)",
    highlights: [
      "Abundant multi-species upland birds, abundant acreage, high in privacy and seclusion",
      "On site lodge located in the middle of the hunting property",
      "20 minutes south of Lemmon South Dakota - Perkins County",
      "Group sizes up to 12",
    ],
    videos: [
      "https://www.youtube.com/embed/v4toDoyDtAU?si=OvXiF4p39dIPYk7h",
      "https://www.youtube.com/embed/pwv4_fKu2Po?si=KatvjcIw6YXbdNL_",
    ],
    reviewTitle: "Meadow Creek Pheasant Camp Reviews",
    reviews: [
      `"Hello Chris, I wanted to follow up with our results for Meadow Creek week 5. The property was far better than we could have expected. The habitat and number of birds was just fantastic. With the abundant pheasants, sharp-tailed grouse, and huns, there was no shortage of hunting. The entire group spent all day hunting until almost sunset each day. On two or three occasions we flushed all three groups of birds at once. What a sight to see, it sure made deciding what shot to take an interesting challenge. The accommodations were very comfortable and complete. This made the evenings enjoyable sitting around talking about the day's hunt and the next day's plan. I especially liked the solitude of the location being far from other residences and general population. Our host was great and spent a couple evening with us to get to know us. He and his family are doing an unbelievable job of creating a special place to hunt by managing the property to improve habitat while creating variety to appeal to different styles of hunting. I can't say enough about their hard work and dedication to making the property special. Thank you for the opportunity to hunt this property. We intend on reserving the property again for next year." - Mike, OR`,
      `"Chris, we had a great time out at Meadow Creek this past weekend. Great mixed bag hunt. The new CRP is thick and holds tons of birds. The new food plots make for some fun areas of concentrated birds. We had a great time hunting and pushing the food plots and surrounding areas, as well as hunting the edges of some of the bigger CRP fields. The owners have really done an awesome job with the habitat. I am sure that it will keep getting better as the grasses come in and provide the winter shelter and nesting habitat. It is a very cool place and the bird numbers this year, all 3 species, are very high. Fun just to watch them all jockey around. The owners are clearly very engaged and motivated. Bunk houses are very nice." - Jeff, WI`,
      `"Great hunt great camp. Huge improvements to this camp this year! Had the time of our lives" - Steve, CA`,
      `"There are not many places in South Dakota where you can limit on Sharptail Grouse in one walk or shoot Sharptail, Hungarians and Ringnecks all on the same day. Meadow Creek is one of them. The unique landscape and habitat management certainly lends itself to multiple upland species. The lodging, bird cleaning and dog accomodations are just what the doctor ordered when it comes to self guided pheasant hunting. All that a group could want." - Chris, MN`,
    ],
  },
  "pheasant-camp-lodge": {
    name: "Pheasant Camp Lodge",
    location: "Lake Andes, South Dakota",
    county: "Charles Mix County",
    description:
      "20 years in the making, the vision for the Pheasant Camp Lodge farm is complete with that last of its 700 production acres being converted to pheasant producing and sustaining CRP. The Pheasant Camp Lodge is the first and Original UGUIDE Pheasant Camp, founded in 2002, and is located 45 miles SW of Mitchell, in Charles Mix County, which borders the eastern side of the beautiful Missouri River. Experience the ultimate in pheasant hunting in South Dakota. This package offers roomy up-to-date lodging. View wildlife from the south facing view of the lodge and start your hunt by walking right out the front door.",
    capacity: "Up to 12 hunters",
    amenities: [
      "1800 Square Foot Lodge - Sleeps up to 12 comfortably",
      "4 bedroom/bunk rooms",
      "Loft has 1 queen bed and one bunk and twin bed",
      "Great room - Recliners and couches for 9, bar height dining table seats 10",
      "Full Kitchen",
      "Mud room/laundry with washer/dryer",
      "2 Large bathrooms w/showers",
      "75' HDTV DISH DVR (Record your football game while hunting - watch later)",
      "Views/Patio/Weber BBQ Grills(2)/Picnic Tables (2)",
      "WIFI High Speed Internet - No Charge",
      "12X30 Insulated heated dog and gear room connected to lodge",
      "(5) Outdoor Dog Kennels next to Lodge",
      "12X18 Bird cleaning shelter - Heated/Insulated - Hot & Cold running water - Chest Freezer",
      "Sheltered indoor parking and grilling area (fits 6 trucks)",
    ],
    images: [flukton1, flukton2, flukton3, flukton4, flukton5, flukton6],
    informativeLinks: [
      { label: "Lodging", href: "#" },
      { label: "Hunting Land", href: "#" },
      { label: "Location Map", href: "#" },
      { label: "Weather", href: "#" },
      { label: "Availability", href: "#" },
      { label: "Tourism Activities", href: "#" },
    ],
    packages: [
      "3-Days Hunting & 4-Nights Lodging for up to 12 Hunters. See Minimum's & Capacities Chart for more info",
    ],
    acres: "700 +/- Acres of exclusively private premium pheasant hunting for your group. All types of cover including 600 acres of CRP in 16 blocks, 100 acres of tree belts in 12 blocks, 55,000 trees planted since 2002, 30 acres of sloughs across 3 parcels. Essentially 90% of total acres are premium high quality huntable acres. 60 acres of corn, milo and other custom food plots in 27 individual plots.",
    highlights: [
      "This Outfitter is a Pheasants Forever Life Member",
      "The whole setup is one huge Man Cave!",
      "Acre for acre, possibly the most optimized pheasant habitat in the state",
      "Began in 2002 and complete in 2023. One of the most unique pheasant hunting properties in South Dakota",
      "Waterfowl hunting, as conditions allow, no additional charge",
      "You can start hunting by walking out of lodge",
    ],
    videos: [
      "https://www.youtube.com/embed/9a93ewFtOKs?si=sYRdbV6fUxMG2p7D",
    ],
    reviewTitle: "Pheasant Camp Lodge Reviews",
    reviews: [
      `"Best Trip Ever - My group of 9 four of us from Tennessee and 5 from Indiana hunted Uguides Pheasant Camp Lodge near Lake Andes last week Fri, Sat and Sun. On Fri the wind blew 40+ mph. We couldn't keep our hats on our head. The birds were super spooky but we were able to scratch out 15. Sat the wind died down and the birds held better. With that and some great shooting we limited with 27. On Sun the fat old guys were pooped but we still got 21 if we would have worked as hard as Sat we would have surely limited that day also. On the way to the airport we ran into freezing rain. I guess a good time to get back to Tennessee. 65 degrees when got off the plane on Nashville. Once my body quits hurting I will be looking forward to next year" - Chip`,
      `"Chris, just finished up with our group of 9 at Pheasant Camp. We really had a great time and with your work at PC and all the food plots and cover there were birds all over...Every morning when we started out right from the lodge we were able to pick up 2 or 3 birds within 20 min.s hunting. You have done a great job with the land management....Love those food plots. Was teasing the brother-n-law that you had put speakers out in the roosting areas, til we watched the birds fly in and out of them. Great job....planning on going back next year." - Paul, IN (Week 4 - 2013 Season)`,
      `"Shot 15 on Friday, 21 on Saturday, and 11 on Sunday (hunted till 2:00). It's a nice piece of property and a really nice bird cleaning set up." - Dan, Minnesota`,
      `"Hi Chris - We did pretty well. There were nine hunters including the two kids and we shot 27 (limit) on both Friday and Saturday and 6 on Sunday when we only hunted until noon. We shot a total 60 birds for the entire weekend and everyone seemed happy so I would call it a success. Thanks" - Patrick, Iowa`,
      `"Chris, My hunting party and I had a wonderful time at your property southwest of Mitchell, SD. The lodge was everything you had said and more. The facility was roomy and we all felt very comfortable and at home. The hosts were hospitable and were very helpful with the layout of the farms. My group limited out two of the three days and should have shot our limit all three days. We saw several hundred birds each day with all types of hunting conditions. All six people from my hunting party will be back to hunt with you again next year. Thank you for a superb hunt." - Jim, Newburgh, IN`,
    ],
  },
  "west-river": {
    name: "West River Adventures Pheasant Camp",
    location: "Timberlake, South Dakota",
    county: "Dewey County",
    description:
      "West River South Dakota not far from the beautiful Missouri breaks area. West River Adventures Pheasant Camp has a huge abundance of CRP and wildlife to offer. If you are looking to hunt a variety of upland birds look no further. Pheasant and Sharptail Grouse abound. Occasional Hungarian Partridge may be encountered as well. Prairie Dog hunting and predator hunting are included with your upland bird hunt package. Get a taste of the WILD West and Big Sky Country!",
    capacity: "Up to 17 hunters",
    amenities: [
      "Spacious modular main lodge that sleeps 12",
      "If you have 10 or more hunters you can utilize both lodges for your group",
      "Spacious Pheasant Hunters mobile home over-looking a very quiet remote private setting",
      "4 spacious Full Bathrooms",
      "Sink, Stove and Fridge and compliment of cooking amenities",
      "Dining table and chairs",
      "Satellite HDTV",
      "BBQ Grill on large deck",
      "Lodging Comfortably accommodates group sizes up to 17",
      "Heated enclosed dog kennel - 12 X 16 right outside lodge",
      "Free use of Lincoln Navigator, Honda Pioneer and 2 other ATV's",
      "For fly-in hunters: airport pickup and use of SUV at no extra charge (Fuel charges will apply)",
    ],
    images: [flukton1, flukton2, flukton3, flukton4, flukton5, flukton6],
    informativeLinks: [
      { label: "Lodging", href: "#" },
      { label: "Hunting Land", href: "#" },
      { label: "Location Map", href: "#" },
      { label: "Local Weather", href: "#" },
      { label: "Availability", href: "#" },
      { label: "Tourism Activities", href: "#" },
    ],
    packages: [
      "3-Days Hunting & 4-Nights Lodging for up to 17 Hunters. See Minimum's & Capacities Chart for more info",
    ],
    acres: "3834 +/- Acres total. 1450 acres of CRP for prime pheasant hunts. 100 acres of food plots planned per season.",
    highlights: [
      "This Outfitter is a Pheasants Forever Life Member",
      "More land than you can hunt",
      "Sharptail, Pheasant and Prairie Dogs included in package",
      "Shoot Prairie Dogs in your spare time. No extra charge",
      "1.5 hours west of Aberdeen SD - Dewey County",
      "Group sizes up to 17, 2 lodges, 4 bathrooms",
    ],
    videos: [
      "https://www.youtube.com/embed/9a93ewFtOKs?si=sYRdbV6fUxMG2p7D",
    ],
    reviewTitle: "West River Adventures Pheasant Camp Reviews",
    reviews: [
      `"Chris, just wanted to fill you in on another great experience at a UGUIDE camp. Our opening weekend hunt at the West River property left absolutely nothing to be desired. I must admit that I was a bit concerned about the number of birds we would see after reading the survey reports from the Game, Fish and Parks and realizing that all of the crops were still in the fields due to the recent wet conditions. Those fears were quickly put aside as we saw hundreds of birds each of our three days of hunting at West River. Our 13 man group downed our allotted 39 birds each day despite the difficult hunting conditions (VERY wet and quite windy). During our return trip home, members of our group talked to a lot of different hunters and we heard very few stories of hunters bagging their daily limits - much less downing 13 man limits for 3 straight days! The hosts were fantastic. They joined us for dinner at the lodge the first night we were there and immediately fell right in with the group, getting to know everybody and telling us tales that had us all in stitches until fairly late in the evening. As for accommodations, the lodge was just right. There was ample room for our entire group (and would have been ample room for several more, if we had them), everybody had their own bed, the kitchen was large and well stocked (we cooked breakfast and dinner at the lodge each day we were there), the dog kennel area was perfect for our pack of Vizsla's and GSP's, and the recent renovations Ron made to the lodge worked out really well. We all had nothing but positive memories to reflect on during our respective drives back to Louisiana and Texas. As evidence of that, our entire group has informed me that they would like to re-book, so count us in for Week 1 next year and, hopefully, for many years to come." - Matt, LA`,
      `"Hi Chris, our Idaho group had yet another great hunt at West River last week. The host is truly a wonderful host with great property and plenty of birds. From the reports we were expecting less birds but found that not to be the case. The abundant amount of CRP land with grass that was deep and heavy this year seemed to hold the birds better and was great for our pointing dogs. We limited our group of 11 and also shot a number of sharp tail grouse, 9 on the first day. We had 3 excellent retrieving dogs and lots very few wounded birds. Please reserve us for West River again next year for the same week 3. I expect a group of at least 10 again. Thanks!" - Randy, ID`,
      `"Hi Chris, just wanted to pass along a note to you about how amazing our hunt was at West River Adventures for week 9. Bird numbers were truly mind numbing. Since this was our first trip to one of your camps, I wasn't quite sure what to expect. WRA and the hosts did not disappoint. The owner was very helpful in getting us on birds and the camp and facilities were exactly as promised. It was the perfect setup for our group of 10. We wanted a trip were we could go and hunt as we wanted, when we wanted. That is exactly what we got to do. We easily saw 5000 birds during our trip. I would love to re-book for next year, but do to other obligations and plans we will not be able to go next year. When we do make another trip however, I certainly will be contacting you again. Thanks again for the great experience." - Erik, WI`,
      `"Chris, just a note to let you know our group of 15 had a great hunt at the West River property. There were 1000's of birds (getting smarter every week) and the challenge was in the pushing, blocking and flanking techniques employed to get shots at the birds. We killed limit two days and could have easily the third day had we not decided an afternoon of watching college football was a good way to end a wonderful three day hunt. The hosts had the place immaculately clean and we did not even hunt a couple of the parcels available this year. You can count on us re-booking for next year and we will make our initial deposits when the time comes." - Paul, NE`,
    ],
  },
  faulkton: {
    name: "Faulkton South Dakota Pheasant Hunting | Faulkton, SD",
    location: "Faulkton, South Dakota",
    county: "Faulk County",
    description: `In regards to habitat and accommodation's, a more thoroughly equipped UGUIDE Pheasant Camp you will not find. The Faulkton Pheasant Camp is located in  the heart of central South Dakota. This camps offers every type of cover in habitat you could ask for in a wild pheasant hunting property. Please review links, video and testimonials below to get a great idea of what this pheasant camp is all about.`,
    images: [flukton1, flukton2, flukton3, flukton4, flukton5, flukton6],
    informativeLinks: [
      { label: "Lodging", href: "#" },
      { label: "Hunting Land", href: "#" },
      { label: "Location Map", href: "#" },
      { label: "Local Weather", href: "#" },
      { label: "Availability", href: "#" },
      { label: "Tourism Activites", href: "#" },
    ],
    packages: [
      "2 Hunt Package Options",
      "4-Day Hunt - Minimum 13 or More Hunters for 4-Days Hunting & 5-Nights Lodging, Or",
      "3-Day Hunt - 17 Hunters required 3-Days Hunting & 4-Nights Lodging",
    ],
    acres: `3200 +/- Acres total. Abundance of all different types of CRP and many acres of corn, milo and soybean food plots for prime pheasant hunts. Read more on the Hunting and Land Photos Page (Link above)
1,200 acres of trees, shrubs, dugouts, lake, cattails, sloughs, natural breaks, railroad grades, food plots and more.`,
    capacity: "Group sizes up to 17",
    highlights: [
      "5 minutes west of Faulkton South Dakota - Faulk County",
      "Group sizes up to 17",
      "Highlights: Free use of (2) Kubota RTV 1100 UTV's, and 2001 F350 Diesel Crew Cab Truck (Fuel charges may apply), fishing in walleye stocked lake included.",
      "Excellent waterfowl hunting. No additional charge. Many sloughs to hunt.",
      "Pheasant Hunters Lodge home over-looking a very quiet remote private setting.",
      "5 Bedrooms, 2 Bathrooms/Showers/Toilets, all linens/towels/washclothes provided",
      "Sink, Stove and Fridge and compliment of cooking amenities",
      "HDTV & Satellite",
      "WIFI High Speed Internet",
      "Dining table and chairs for 10",
      "Heated insulated Dog Kennel, 10 sanitary dog huts with comfort mats and water. Dairy board walls and automatic lights.",
      "State of the Art Bird Cleaning Station",
      "Clay pigeon thrower with complimentary box of shells and 25 targets for each hunter",
      "Bon Fire Pit",
      "Weber Gas BBQ Grill",
    ],
    amenities: [
      "Free use of (2) Kubota RTV 1100 UTV's",
      "2001 F350 Diesel Crew Cab Truck",
      "Fishing in walleye stocked lake",
      "Waterfowl hunting access",
      "5 Bedroom Lodge",
      "2 Bathrooms with showers",
      "Full kitchen with amenities",
      "HDTV & Satellite",
      "High Speed WIFI",
      "Dog Kennel (10 huts)",
      "Bird Cleaning Station",
      "Clay pigeon thrower + shells",
      "Bonfire pit",
      "Weber Gas BBQ Grill",
    ],
    videos: [
      "https://www.youtube.com/embed/fiHRMGa8ATk?si=CZBkUckppJZNUjPU",
      "https://www.youtube.com/embed/uJdlXdw7Qdg?si=tLXY9yphinpmNjIG",
      "https://www.youtube.com/embed/32yWJZECW5k?si=pOXofwgAI9nbkwje",
    ],
    reviewTitle: "Faulkton Pheasant Camp Reviews",
    reviews: [
      `"Hi Chris, we battled record breaking high temps (64F) and high winds (gusts to 40 mph) so the birds were very wild but we managed limits every day for those that could shoot. A couple of our group fired "at" way more than their limit each day but seemed to have confetti in their shells instead of shot! I'm beginning to think that they are actually moles for the Audubon Society J. We picked up a total of 96 roosters and earned every one of them. The Faulkton Camp continues to exceed expectations. The habitat is beautiful, the bird numbers astounding, and the accommodations first rate. The owner/operator is a most interesting and congenial host. Thank you both! Oh, and the new caps are awesome! Guy - week 8, 2012. -Tennessee"`,
      `"We're all home safe and sound but everyone wishes that we were back at your place! What a great time we had. The lodge was spacious and clean, the beds were comfortable, and the facilities/equipment were first rate. Your habitat is awesome and produces an absolute astounding number of birds! All of us got our limit each day and that didn't even begin to scratch the number of birds we saw. It must be comforting to know that the habitat you've created allows your birds to weather a terrible winter like last year's and still produce the big numbers that we saw this year. I can only imagine what kind of numbers a "normal" winter/spring produces for you in this habitat. Thank you for sharing your bounty with us! We are already in the process of re-enlisting with UGUIDE for next year and I hope this arrangement remains fun and profitable for you both. Thank you for a great hunt and we all look forward to seeing you next year!" Guy - week 8, 2011. -Tennessee`,
      `"By the way, the hunt and the setup at the Faulkton camp were excellent. We all came away with nothing but positive feelings about it." Matt - Louisiana`,
      `"We can hunt pen-raised birds in Wisconsin. We enjoy your wild pheasant hunt. We like the freedom at your camp...the use of your equipment is a big plus for us. [This is the] best place in SD. We have hunted your camp several years and already rebooked." Lou, Delafield WI`,
      `"We all thank you for your great hospitality. Since 2005, the 7 to 10 of us have hunted your place. [You're] always making more improvements. You take customer satisfaction to a new level." Garland, Shelbyville, KY`,
      `"We all would like to thank your for your great hospitality, and your farm was a pheasant bonus, with birds calling and flying around all day. It all made for such an exciting time. The lodge was just like home and you have the best habitat for birds." Ernie, Delleville, MI`,
      `"We had a great time. We all filled out; there were lots of birds. It was great hunting and a nice lodge. Keep up the good work and management; thanks for having us." Tom, Schoolcraft, MI`,
    ],
  },
};

export default async function CampDetailPage({ params }: { params: any }) {
  const { id } = await params;
  const camp = campDetails[id];

  if (!camp) {
    notFound();
  }

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="CampsImage relative flex min-h-[340px] items-center justify-center px-4 pb-20 pt-24 sm:min-h-[430px] sm:px-6 sm:pb-24 sm:pt-28 md:min-h-[520px] lg:min-h-[580px]">
        <div className="absolute inset-0 bg-[#f1c08b]/35" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-[70px] font-bold uppercase leading-none text-[#281703] ">
            {camp.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#281703] sm:mt-6 sm:gap-3 sm:text-[12px]">
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors hover:text-[#F16724]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3.172 3 10.2V21h6v-6h6v6h6V10.2l-9-7.028Z" />
              </svg>
              <span>Home</span>
            </Link>
            <span>›</span>
            <Link
              href="/camps"
              className="transition-colors hover:text-[#F16724]"
            >
              Camps
            </Link>
            <span>›</span>
            <span>{camp.name}</span>
          </div>
        </div>
      </section>

      {/* Camp Details */}
      <section className="bg-[#E7DCCF] px-4 pb-16 pt-14 sm:px-6 sm:pt-18">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="mb-6 text-[30px] font-bold text-[#281703] sm:text-[34px]">
                {camp.name}
              </h2>
              <p className="mb-6 text-base text-[#2f2b27] sm:text-lg">
                {camp.description}
              </p>

              {camp.informativeLinks && (
                <div className="mb-6">
                  <strong className="mb-2 block">Informative Links:</strong>
                  <ul className="flex flex-wrap gap-3 text-sm">
                    {camp.informativeLinks.map((link: InformativeLink) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[#F16724] underline"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {camp.packages && (
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-bold text-[#281703]">
                    {camp.name.includes("Faulkton") ? "Faulkton Pheasant Camp" : "Hunt Package Options"}
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-black">
                    {camp.packages.map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                  {camp.acres && <p className="mt-3 text-sm whitespace-pre-line text-black">{camp.acres}</p>}
                </div>
              )}

              {camp.highlights && (
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-bold text-[#281703]">Highlights</h3>
                  <ul className="list-disc pl-5 text-sm text-black">
                    {camp.highlights.map((highlight: string, i: number) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4 text-black">
                <div>
                  <strong>Location:</strong> {camp.location}
                </div>
                <div>
                  <strong>County:</strong> {camp.county}
                </div>
                {camp.capacity && (
                  <div>
                    <strong>Capacity:</strong> {camp.capacity}
                  </div>
                )}
              </div>

              <div className="mt-8 text-black">
                <h3 className="mb-4 text-xl font-bold text-[#281703]">
                  Amenities
                </h3>
                <ul className="space-y-2 text-black">
                  {camp.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-[#F16724]">✓</span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/quote-reserve"
                  className="inline-block text-[#F16724] underline font-semibold transition-colors"
                >
                  Request Quote
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {/* VIDEOS */}
              {camp.videos && camp.videos.length > 0 && (
                <div>
                  <h3 className="mb-3 font-bold text-[#281703]">Videos</h3>
                  <div className="space-y-4">
                    {camp.videos.map((v, i) => (
                      <div key={i} className="relative pt-[56.25%]">
                        <iframe
                          src={v}
                          className="absolute top-0 left-0 h-full w-full rounded"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {camp.reviews && (
          <div className="mx-auto mt-5 max-w-7xl">
            <div className="mb-2 text-left">
              <h3 className="text-3xl font-bold text-[#281703]">
                {camp.reviewTitle || "Reviews"}
              </h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {camp.reviews.map((review, index) => (
                <div key={index} className="relative transition">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-[#2f2b27]">
                    {review}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-10">
          {camp.images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`${camp.name} image ${i + 1}`}
              width={1000}
              height={1000}
              className="h-96 w-96 rounded object-cover"
            />
          ))}
        </div>
      </section>
    </main>
  );
}