/*
 * Copyright 2015 Red Hat, Inc. and/or its affiliates
 * and other contributors as indicated by the @author tags.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.scribble.web.rest;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.MediaType.APPLICATION_JSON_TYPE;
import static javax.ws.rs.core.MediaType.TEXT_PLAIN;
import static javax.ws.rs.core.MediaType.TEXT_PLAIN_TYPE;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.Response;

import org.scribble.web.api.DefinitionManager;

import com.wordnik.swagger.annotations.Api;
import com.wordnik.swagger.annotations.ApiOperation;
import com.wordnik.swagger.annotations.ApiParam;
import com.wordnik.swagger.annotations.ApiResponse;
import com.wordnik.swagger.annotations.ApiResponses;

/**
 * REST interface for managing scribble protocols.
 *
 * @author gbrown
 *
 */
@Path("/")
@Consumes(TEXT_PLAIN)
@Produces(TEXT_PLAIN)
@Api(value = "/", description = "Protocol administration")
public class ProtocolHandler {
    
    @Inject
    private DefinitionManager definitionManager;

    @PUT
    @Path("/protocols/{module}/{protocol}")
    @ApiOperation(value = "Create or update a protocol definition")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Create or update protocol succeeded."),
            @ApiResponse(code = 500, message = "Unexpected error happened while creating or updating the protocol") })
    public void createProtocol(
            @Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module name") @PathParam("module") String moduleName,
            @ApiParam(required = true, value = "The protocol name") @PathParam("protocol") String protocolName,
            @ApiParam(value = "The protocol definition", required = true) String definition) {

        try {
            definitionManager.updateProtocol(moduleName, protocolName, definition);

            response.resume(Response.status(Response.Status.OK).build());

        } catch (Throwable t) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + t.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(TEXT_PLAIN_TYPE).build());
        }
    }

    @GET
    @Path("/protocols/{module}/{protocol}")
    @Produces(TEXT_PLAIN)
    @ApiOperation(
            value = "Retrieve protocol definition for module and protocol name",
            response = String.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, protocol definition found and returned"),
            @ApiResponse(code = 500, message = "Internal server error"),
            @ApiResponse(code = 400, message = "Unknown module and/or protocol name") })
    public void getProtocol(@Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module") @PathParam("module") String moduleName,
            @ApiParam(required = true, value = "The protocol name") @PathParam("protocol") String protocolName) {

        try {
            String protocol = definitionManager.getProtocol(moduleName, protocolName);

            if (protocol == null) {
                response.resume(Response.status(Response.Status.BAD_REQUEST).type(TEXT_PLAIN_TYPE).build());
            } else {
                response.resume(Response.status(Response.Status.OK).entity(protocol).type(TEXT_PLAIN_TYPE)
                        .build());
            }
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(TEXT_PLAIN_TYPE).build());
        }

    }

    @GET
    @Path("/protocols")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve the list of modules",
            response = List.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, modules found and returned"),
            @ApiResponse(code = 500, message = "Internal server error") })
    public void getModules(@Suspended final AsyncResponse response) {

        try {
            Set<String> names = definitionManager.getModuleNames();

            List<String> sorted=new ArrayList<String>(names);
            
            Collections.sort(sorted);
            
            response.resume(Response.status(Response.Status.OK).entity(sorted).type(APPLICATION_JSON_TYPE)
                        .build());
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

    @GET
    @Path("/protocols/{module}")
    @Produces(APPLICATION_JSON)
    @ApiOperation(
            value = "Retrieve protocol names within specified module",
            response = String.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Success, module protocol names found and returned"),
            @ApiResponse(code = 500, message = "Internal server error"),
            @ApiResponse(code = 400, message = "Unknown module name") })
    public void getProtocols(@Suspended final AsyncResponse response,
            @ApiParam(required = true, value = "The module") @PathParam("module") String moduleName) {

        try {
            Set<String> names = definitionManager.getProtocolNames(moduleName);

            List<String> sorted=new ArrayList<String>(names);
            
            Collections.sort(sorted);
            
            response.resume(Response.status(Response.Status.OK).entity(sorted).type(APPLICATION_JSON_TYPE)
                        .build());
        } catch (Exception e) {
            Map<String, String> errors = new HashMap<String, String>();
            errors.put("errorMsg", "Internal Error: " + e.getMessage());
            response.resume(Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(errors).type(APPLICATION_JSON_TYPE).build());
        }

    }

}
