import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';
import { CreateLocationInput } from './dto/create-location.input';

@Resolver(() => Location)
export class LocationResolver {
  constructor(
    private readonly locationService: LocationService,
  ) {}



// =========================
// ➕ CREATE LOCATION
// =========================
@Mutation(() => Location)
async createLocation(
  @Args('input') input: CreateLocationInput,
): Promise<Location> {
  return this.locationService.createLocation(
    input.name,
    input.level,
    input.parentId,
  );
}




  // =========================
  // 🌍 GET CHILD LOCATIONS
  // =========================
  @Query(() => [Location])
  async getLocations(
    @Args('parentId', { nullable: true }) parentId?: string,
  ): Promise<Location[]> {
    return this.locationService.getByParent(parentId);
  }

  // =========================
  // 📍 GET LOCATION CHAIN
  // =========================
  @Query(() => [Location])
  async getLocationChain(
    @Args('locationId') locationId: string,
  ): Promise<Location[]> {
    return this.locationService.getLocationChain(locationId);
  }
}